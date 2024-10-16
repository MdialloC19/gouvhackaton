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

        const service = await this.serviceService.findOne(serviceId.toString());

        if (!service) {
            throw new NotFoundException(
                `Service with ID ${serviceId} not found`,
            );
        }
        const responses: any = {
            textResponses: {},
            documentResponses: {},
        };

        if (textResponses && Object.keys(textResponses).length > 0) {
            for (const [fieldLabel, response] of Object.entries(
                textResponses,
            )) {
                if (response === null || response === undefined) {
                    throw new BadRequestException(
                        `Text response for field ${fieldLabel} is null or undefined.`,
                    );
                }

                const field = service.fields.find((f) => f.name === fieldLabel);
                if (!field) {
                    throw new BadRequestException(
                        `Field with label ${fieldLabel} not found in service ${service._id}`,
                    );
                }

                responses.textResponses[fieldLabel] = response;
            }
        }

        if (documentResponses && Object.keys(documentResponses).length > 0) {
            for (const [fieldLabel, response] of Object.entries(
                documentResponses,
            )) {
                if (response === null || response === undefined) {
                    throw new BadRequestException(
                        `Document response for field ${fieldLabel} is null or undefined.`,
                    );
                }

                const field = service.fields.find((f) => f.name === fieldLabel);
                if (!field) {
                    throw new BadRequestException(
                        `Field with label ${fieldLabel} not found in service ${service._id}`,
                    );
                }

                const docId = response.toString();
                if (!docId) {
                    throw new BadRequestException(
                        `Document ID for field ${fieldLabel} is invalid.`,
                    );
                }

                const documentExists =
                    await this.documentService.getDocumentById(docId);
                if (!documentExists) {
                    throw new NotFoundException(
                        `Document with ID ${docId} not found`,
                    );
                }

                responses.documentResponses[fieldLabel] = docId;
            }
        }

        const newRequest = new this.requestModel({
            ...createRequestDto,
            createdAt: new Date(),
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
                    await this.fonctionnaireService.findOne(
                        fonctionnaireId.toString(),
                    );
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
            .populate('institution citoyen service processedBy')
            .exec();
    }

    async findById(id: string): Promise<Request> {
        const request = await this.requestModel
            .findById(id)
            .populate('service institution processedBy citoyen')
            .exec();
        if (!request) {
            throw new NotFoundException(`Request with ID ${id} not found`);
        }
        return request;
    }

    async findByCitoyen(citoyenId: string): Promise<Request[]> {
        const requests = await this.requestModel
            .find({ citoyen: citoyenId })
            .populate('service institution processedBy citoyen')
            .exec();
        if (requests.length === 0) {
            throw new NotFoundException(
                `No requests found for citoyen with ID ${citoyenId}`,
            );
        }
        return requests;
    }

    async findByServiceAndStatus(
        serviceId: string,
        fonctionnaireId: string,
        status?: string,
        page: number = 1,
        limit: number = 20,
        sort?: string,
        filter?: string,
    ) {
        const fonctionnaire =
            await this.fonctionnaireService.findOne(fonctionnaireId);
        if (!fonctionnaire) {
            throw new NotFoundException(
                `Fonctionnaire with ID ${fonctionnaireId} not found.`,
            );
        }

        const service = await this.serviceService.findOne(serviceId);
        if (!service) {
            throw new NotFoundException(
                `Service with ID ${serviceId} not found.`,
            );
        }

        const sortFields = {};

        if (sort) {
            const sortArray = sort.split(',');
            sortArray.forEach((field) => {
                const direction = field.startsWith('-') ? -1 : 1;
                const fieldName = field.substring(1);
                sortFields[fieldName] = direction;
            });
        } else {
            sortFields['createdAt'] = 1;
        }

        const query = this.requestModel.find({
            service: serviceId,
            institution: fonctionnaire.institution._id.toString(),
        });

        if (status) {
            query.where({ state: status });
        }

        if (filter) {
            query.where(JSON.parse(filter));
        }

        const totalCount = await this.requestModel
            .countDocuments({
                service: serviceId,
                institution: fonctionnaire.institution._id.toString(),
                ...(status ? { state: status } : {}),
                ...(filter ? JSON.parse(filter) : {}),
            })
            .exec();

        const requests = await query
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(sortFields)
            .populate('service institution processedBy citoyen')
            .exec();

        if (!requests || requests.length === 0) {
            throw new NotFoundException(
                `No requests found for service with ID ${serviceId}`,
            );
        }


        return {
            status: 'success',
            message: 'Requests retrieved successfully',
            data: requests,
            metadata: {
                total_count: totalCount,
            },
        };
    }

    async countByServiceAndInstitution(serviceId: string, institutionId: string): Promise<number> {
        return this.requestModel.countDocuments({
            service: serviceId,
            institution: institutionId,
        }).exec();
    }

    async findByInstitution(institutionId: string): Promise<Request[]> {
        const requests = await this.requestModel
            .find({ institution: institutionId })
            .populate('service institution processedBy citoyen')
            .exec();
        if (requests.length === 0) {
            throw new NotFoundException(
                `No requests found for institution with ID ${institutionId}`,
            );
        }
        return requests;
    }

    async remove(id: string): Promise<Request> {
        const deletedrequest = await this.requestModel
            .findByIdAndDelete(id)
            .exec();
        if (!deletedrequest) {
            throw new NotFoundException(`request with ID "${id}" not found`);
        }
        return deletedrequest;
    }

    async findByProcessedBy(fonctionnaireId: string): Promise<Request[]> {
        const requests = await this.requestModel
            .find({ processedBy: fonctionnaireId})
            .populate('service institution processedBy citoyen')
            .exec();
        if (requests.length === 0) {
            throw new NotFoundException(
                `No requests found for fonctionnaire with ID ${fonctionnaireId}`,
            );
        }
        return requests;
    }

    async getList(
        range?: string,
        sort?: string,
        filter?: string,
    ): Promise<Request[]> {
        const query = this.requestModel.find(JSON.parse(filter || '{}'));

        if (sort) {
            const [field, order] = JSON.parse(sort);
            query.sort({ [field]: order === 'ASC' ? 1 : -1 });
        }

        if (range) {
            const [start, end] = JSON.parse(range);
            query.skip(start).limit(end - start + 1);
        }

        return query.exec();
    }

    async countFiltered(filter?: string): Promise<number> {
        return this.requestModel
            .countDocuments(JSON.parse(filter || '{}'))
            .exec();
    }

    async getMany(filter: string): Promise<Request[]> {
        const filterCriteria = filter ? JSON.parse(filter) : {};
        const ids = filterCriteria.id || [];

        return this.requestModel.find({ _id: { $in: ids } }).exec();
    }

    async getManyReference(filter: string): Promise<Request[]> {
        const filterCriteria = filter ? JSON.parse(filter) : {};

        return this.requestModel.find(filterCriteria).exec();
    }
}
