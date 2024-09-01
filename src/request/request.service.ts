import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Request } from './request.schema';
import { CreateRequestDto } from './dto/create-request.dto';
import { DocumentService } from '../document/document.service';
import { ServiceService } from 'src/service/service.service';

@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Request.name)
        private readonly requestModel: Model<Request>,
        private readonly documentService: DocumentService,
        private readonly serviceService: ServiceService,
    ) {}

    async createRequest(createRequestDto: CreateRequestDto): Promise<Request> {
        const {
            service: serviceId,
            institution: institutionId,
            documents,
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

        for (const docId of documents) {
            const documentExists = await this.documentService.getDocumentById(
                docId.toString(),
            );
            if (!documentExists) {
                throw new NotFoundException(
                    `Document with ID ${docId} not found`,
                );
            }
        }

        const newRequest = new this.requestModel({
            ...createRequestDto,
        });
        return await newRequest.save();
    }

    async findAll(): Promise<Request[]> {
        return this.requestModel
            .find()
            .populate('citoyen service institution documents processedBy')
            .exec();
    }

    async findById(id: string): Promise<Request> {
        const request = await this.requestModel
            .findById(id)
            .populate('citoyen service institution documents processedBy')
            .exec();
        if (!request) {
            throw new NotFoundException(`Request with ID ${id} not found`);
        }
        return request;
    }
}
