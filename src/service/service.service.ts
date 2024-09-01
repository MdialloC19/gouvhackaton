import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Service } from './service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InstitutionService } from '../institution/institution.service';
import { Institution } from 'src/institution/institution.schema';

@Injectable()
export class ServiceService {
    constructor(
        @InjectModel(Service.name) private serviceModel: Model<Service>,
        private readonly institutionService: InstitutionService,
    ) {}

    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        const createdService = new this.serviceModel(createServiceDto);
        return createdService.save();
    }

    async findAll(): Promise<Service[]> {
        return this.serviceModel
            .find()
            .populate('institutions')
            .populate('fields')
            .exec();
    }

    async findOne(id: string): Promise<Service> {
        const service = await this.serviceModel
            .findById(id)
            .populate('institutions')
            .populate('fields')
            .exec();
        if (!service) {
            throw new NotFoundException(`Service with ID "${id}" not found`);
        }
        return service;
    }

    async findByInstitution(institutionId: string): Promise<Service[]> {
        const institution =
            await this.institutionService.findOne(institutionId);
        return this.serviceModel.find({ institutions: institution }).exec();
    }

    async update(
        id: string,
        updateServiceDto: UpdateServiceDto,
    ): Promise<Service> {
        const updatedService = await this.serviceModel
            .findByIdAndUpdate(id, updateServiceDto, { new: true })
            .exec();
        if (!updatedService) {
            throw new NotFoundException(`Service with ID "${id}" not found`);
        }
        return updatedService;
    }

    async remove(id: string): Promise<Service> {
        const deletedService = await this.serviceModel
            .findByIdAndDelete(id)
            .exec();
        if (!deletedService) {
            throw new NotFoundException(`Service with ID "${id}" not found`);
        }
        return deletedService;
    }

    async removeInstitutionFromService(
        serviceId: string,
        institutionId: string,
    ): Promise<Service> {
        const service = await this.serviceModel.findById(serviceId).exec();
        if (!service) {
            throw new NotFoundException(
                `Service with ID ${serviceId} not found`,
            );
        }

        const institution =
            await this.institutionService.findOne(institutionId);
        if (!institution) {
            throw new NotFoundException(
                `Institution with ID ${institutionId} not found`,
            );
        }

        const institutionIndex = service.institutions.findIndex(
            (inst) => inst._id.toString() === institution._id.toString(),
        );

        if (institutionIndex === -1) {
            throw new NotFoundException(
                `Institution with ID ${institutionId} not found in service`,
            );
        }

        service.institutions.splice(institutionIndex, 1);

        await service.save();

        return service;
    }

    // Méthode pour ajouter une institution à un service
    async addInstitutionToService(
        serviceId: string,
        institutionId: string,
    ): Promise<Service> {
        const service = await this.serviceModel.findById(serviceId);
        if (!service) {
            throw new NotFoundException(
                `Service with ID ${serviceId} not found`,
            );
        }

        const institution =
            await this.institutionService.findOne(institutionId);
        if (!institution) {
            throw new NotFoundException(
                `Institution with ID ${institutionId} not found`,
            );
        }

        if (service.institutions.includes(institution.id)) {
            throw new ConflictException(
                'Institution already associated with this service',
            );
        }

        service.institutions.push(institution);
        await service.save();
        return service;
    }
}
