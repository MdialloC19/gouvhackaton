import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Request } from './request.schema';
import { CreateRequestDto } from './dto/create-request-citoyen.dto';
import { DocumentService } from '../document/document.service';
import { ServiceService } from 'src/service/service.service';
import { UpdateRequestDto } from './dto/update-request-fonctionnaire.dto';
import { FonctionnaireService } from 'src/fonctionnaire/fonctionnaire.service';

@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Request.name)
        private readonly requestModel: Model<Request>,
        private readonly documentService: DocumentService,
        private readonly serviceService: ServiceService,
        private readonly fonctionnaireService: FonctionnaireService,
    ) {}

    // CITOYEN
    async createRequest(createRequestDto: CreateRequestDto): Promise<Request> {
        const {
            service: serviceId,
            institution: institutionId,
            textResponses,
            documentResponses,
        } = createRequestDto;

        const service = await this.serviceService.findOne(serviceId);
        if (!service) {
            throw new NotFoundException(
                `Service with ID ${serviceId} not found`,
            );
        }

        const institutionExists = service.institutions.some(
            (inst: any) => inst._id.toString() === institutionId,
        );

        if (!institutionExists) {
            throw new BadRequestException(
                `Institution with ID ${institutionId} is not part of the service`,
            );
        }

        for (const fieldId in documentResponses) {
            if (documentResponses.hasOwnProperty(fieldId)) {
                const docId = documentResponses[fieldId].toString();
                const documentExists =
                    await this.documentService.getDocumentById(docId);
                if (!documentExists) {
                    throw new NotFoundException(
                        `Document with ID ${docId} not found`,
                    );
                }
            }
        }
        const responses: any = {
            textResponses: {},
            documentResponses: {},
            createdAt: new Date(),
        };

        for (const [fieldLabel, response] of Object.entries(textResponses)) {
            const field = service.fields.find((f) => f.label === fieldLabel);

            if (!field) {
                throw new BadRequestException(
                    `Field with label ${fieldLabel} not found in service ${service._id}`,
                );
            }

            if (field.fieldType === 'file') {
                const docId = response.toString();
                const documentExists =
                    await this.documentService.getDocumentById(docId);

                if (!documentExists) {
                    throw new NotFoundException(
                        `Document with ID ${docId} not found`,
                    );
                }

                responses.documentResponses[fieldLabel] = docId;
            } else {
                responses.textResponses[fieldLabel] = response;
            }
        }

        const newRequest = new this.requestModel({
            ...createRequestDto,
            dateAndHour: new Date(),
            state: 'en-cours',
        });
        return await newRequest.save();
    }

    // AGENT

    async update(id: string, updateRequestDto: UpdateRequestDto) {
        const {
            dateAndHourTreatment,
            state,
            commentByAgent,
            documentsByAgent,
            processedBy,
        } = updateRequestDto;

        const request = await this.requestModel.findById(id).exec();
        if (!request) {
            throw new NotFoundException(`Request with ID ${id} not found`);
        }

        if (documentsByAgent) {
            for (const docId of documentsByAgent) {
                const documentExists =
                    await this.documentService.getDocumentById(docId);
                if (!documentExists) {
                    throw new NotFoundException(
                        `Document with ID ${docId} not found`,
                    );
                }
            }
        }
        if (processedBy) {
            for (const fonctionnaireId of processedBy) {
                const fonctionnaireExists =
                    await this.fonctionnaireService.findOne(fonctionnaireId);
                if (!fonctionnaireExists) {
                    throw new NotFoundException(
                        `Fonctionnaire with ID ${fonctionnaireId} not found`,
                    );
                }
            }
        }
        const updatedRequest = await this.requestModel
            .findByIdAndUpdate(id, updateRequestDto, { new: true })
            .exec();
        if (!updatedRequest) {
            throw new NotFoundException(`Request with ID ${id} not found`);
        }

        return updatedRequest;
    }

    async findAll(): Promise<Request[]> {
        return this.requestModel
            .find()
            .populate('citoyen service institution processedBy')
            .exec();
    }

    async findById(id: string): Promise<Request> {
        const request = await this.requestModel
            .findById(id)
            .populate('service institution processedBy')
            .exec();
        if (!request) {
            throw new NotFoundException(`Request with ID ${id} not found`);
        }
        return request;
    }

    async findByCitoyen(citoyenId: string): Promise<Request[]> {
        const requests = await this.requestModel
            .find({ citoyen: new Types.ObjectId(citoyenId) })
            .populate('service institution processedBy')
            .exec();
        if (requests.length === 0) {
            throw new NotFoundException(
                `No requests found for citoyen with ID ${citoyenId}`,
            );
        }
        return requests;
    }

    async findByService(serviceId: string): Promise<Request[]> {
        const requests = await this.requestModel
            .find({ service: new Types.ObjectId(serviceId) })
            .populate('citoyen institution processedBy')
            .exec();
        if (requests.length === 0) {
            throw new NotFoundException(
                `No requests found for service with ID ${serviceId}`,
            );
        }
        return requests;
    }

    async findByInstitution(institutionId: string): Promise<Request[]> {
        const requests = await this.requestModel
            .find({ institution: new Types.ObjectId(institutionId) })
            .populate('citoyen service processedBy')
            .exec();
        if (requests.length === 0) {
            throw new NotFoundException(
                `No requests found for institution with ID ${institutionId}`,
            );
        }
        return requests;
    }

    async findByProcessedBy(fonctionnaireId: string): Promise<Request[]> {
        const requests = await this.requestModel
            .find({ processedBy: new Types.ObjectId(fonctionnaireId) })
            .populate('citoyen service institution')
            .exec();
        if (requests.length === 0) {
            throw new NotFoundException(
                `No requests found for fonctionnaire with ID ${fonctionnaireId}`,
            );
        }
        return requests;
    }
}
