import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InstitutionService } from '../institution/institution.service';

@Injectable()
export class ServiceService {
    constructor(
        @InjectModel(Service.name) private serviceModel: Model<Service>,
        private readonly institutionService: InstitutionService,
    ) {}

    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        const { name, link, ...rest } = createServiceDto;

        const existingName = await this.serviceModel.findOne({ name }).exec();
        if (existingName) {
            throw new ConflictException(
                'Service with this name already exists',
            );
        }

        const existingLink = await this.serviceModel.findOne({ link }).exec();
        if (existingLink) {
            throw new ConflictException(
                'Service with this link already exists',
            );
        }

        const createdService = new this.serviceModel({ name, link, ...rest });
        return createdService.save();
    }

    async findAll(): Promise<Service[]> {
        return this.serviceModel
            .find()
            .populate('institutions')
            .exec();
    }

    async findOne(id: string): Promise<Service> {
        const service = await this.serviceModel
        .findById(id)
        .populate('institutions')
        .exec();
        console.log(await this.serviceModel.find({}).exec())    
        return service;
    }

    async findByInstitution(institutionId: string): Promise<Service[]> {
        const institution =
            await this.institutionService.findOne(institutionId);
        return this.serviceModel.find({ institutions: institution })
        .populate('institutions')
        .exec();
    }

    async update(
        id: string,
        updateServiceDto: UpdateServiceDto,
    ): Promise<Service> {
        const updatedService = await this.serviceModel
            .findByIdAndUpdate(id, updateServiceDto, { new: true })
            .populate('institutions')
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

    async getDistinctCategories(): Promise<string[]> {
        return this.serviceModel.distinct('category').exec();
    }

    async getByCategory(category: string): Promise<Service[]> {
        return this.serviceModel.find({ category }).exec();
    }
    async findByName(name: string): Promise<Service> {
        return this.serviceModel.findOne({ name }).exec();
    }

    async getList(
        range?: string,
        sort?: string,
        filter?: string,
    ): Promise<Service[]> {
        const query = this.serviceModel.find(JSON.parse(filter || '{}'));

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
        return this.serviceModel
            .countDocuments(JSON.parse(filter || '{}'))
            .exec();
    }

    async getMany(filter: string): Promise<Service[]> {
        const filterCriteria = filter ? JSON.parse(filter) : {};
        const ids = filterCriteria.id || [];

        return this.serviceModel.find({ _id: { $in: ids } }).exec();
    }

    async getManyReference(filter: string): Promise<Service[]> {
        const filterCriteria = filter ? JSON.parse(filter) : {};

        return this.serviceModel.find(filterCriteria).exec();
    }
}
