import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Institution } from './institution.schema';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
    constructor(
        @InjectModel(Institution.name)
        private readonly institutionModel: Model<Institution>,
    ) {}

    async create(
        createInstitutionDto: CreateInstitutionDto,
    ): Promise<Institution> {
        const createdInstitution = new this.institutionModel(
            createInstitutionDto,
        );
        return createdInstitution.save();
    }

    async findAll(): Promise<Institution[]> {
        const institutions = await this.institutionModel.find().exec();
        if (institutions.length === 0) {
            throw new NotFoundException('No institutions found');
        }
        return institutions;
    }

    async findOne(id: string): Promise<Institution> {
        const institution = await this.institutionModel.findById(id).exec();
        if (!institution) {
            throw new NotFoundException(
                `Institution with ID "${id}" not found`,
            );
        }
        return institution;
    }

    async findByName(name: string): Promise<Institution> {
        const institution = await this.institutionModel
            .findOne({ name })
            .exec();
        if (!institution) {
            throw new NotFoundException(
                `Institution with name "${name}" not found`,
            );
        }
        return institution;
    }

    async update(
        id: string,
        updateInstitutionDto: UpdateInstitutionDto,
    ): Promise<Institution> {
        const updatedInstitution = await this.institutionModel
            .findByIdAndUpdate(id, updateInstitutionDto, { new: true })
            .exec();
        if (!updatedInstitution) {
            throw new NotFoundException(
                `Institution with ID "${id}" not found`,
            );
        }
        return updatedInstitution;
    }

    async remove(id: string) {
        const result = await this.institutionModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(
                `Institution with ID "${id}" not found`,
            );
        }
        return { message: 'Institution deleted successfully' };
    }

    async findByDomain(domain: string): Promise<Institution[]> {
        const institutions = await this.institutionModel
            .find({ domain })
            .exec();
        if (institutions.length === 0) {
            throw new NotFoundException(
                `No institutions found for domain "${domain}"`,
            );
        }
        return institutions;
    }

    async getDistinctDomains(): Promise<string[]> {
        const institutions = await this.institutionModel.find().exec();
        if (institutions.length === 0) {
            throw new NotFoundException(
                'No institutions found to extract domains',
            );
        }
        const domains = institutions.map((institution) => institution.domain);
        return [...new Set(domains)];
    }

    async getList(
        range?: string,
        sort?: string,
        filter?: string,
    ): Promise<Institution[]> {
        const query = this.institutionModel.find(JSON.parse(filter || '{}'));

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
        return this.institutionModel
            .countDocuments(JSON.parse(filter || '{}'))
            .exec();
    }

    async getMany(filter: string): Promise<Institution[]> {
        const filterCriteria = filter ? JSON.parse(filter) : {};
        const ids = filterCriteria.id || [];

        return this.institutionModel.find({ _id: { $in: ids } }).exec();
    }

    async getManyReference(filter: string): Promise<Institution[]> {
        const filterCriteria = filter ? JSON.parse(filter) : {};

        return this.institutionModel.find(filterCriteria).exec();
    }
}
