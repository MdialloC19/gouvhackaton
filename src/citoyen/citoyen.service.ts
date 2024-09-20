import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Citoyen } from './citoyen.schema';
import { CreateCitoyenDto } from './dto/create-citoyen.dto';
import { UpdateCitoyenDto } from './dto/update-citoyen.dto';

@Injectable()
export class CitoyenService {
    institutionModel: any;
    constructor(
        @InjectModel(Citoyen.name) private citoyenModel: Model<Citoyen>,
    ) {}

    async create(createCitoyenDto: CreateCitoyenDto): Promise<Citoyen> {
        const { CNI, phoneNumber } = createCitoyenDto;
        const existingCni = await this.citoyenModel.findOne({ CNI }).exec();
        if (existingCni) {
            throw new ConflictException('CNI already exists');
        }
        const existingPhoneNumber = await this.citoyenModel
            .findOne({ phoneNumber })
            .exec();
        if (existingPhoneNumber) {
            throw new ConflictException('Phone number already exists');
        }
        const createdCitoyen = new this.citoyenModel(createCitoyenDto);
        return createdCitoyen.save();
    }

    async findAll(): Promise<Citoyen[]> {
        return this.citoyenModel.find().select('-password').exec();
    }

    async findOne(id: string): Promise<Citoyen> {
        const citoyen = await this.citoyenModel
            .findById(id)
            .select('-password')
            .exec();
        if (!citoyen) {
            throw new NotFoundException(`Citoyen with ID ${id} not found`);
        }
        return citoyen;
    }

    async update(
        id: string,
        updateCitoyenDto: UpdateCitoyenDto,
    ): Promise<Citoyen> {
        const updatedCitoyen = await this.citoyenModel
            .findByIdAndUpdate(id, updateCitoyenDto, {
                new: true,
            })
            .select('-password')
            .exec();
        if (!updatedCitoyen) {
            throw new NotFoundException(`Citoyen with ID ${id} not found`);
        }
        return updatedCitoyen;
    }

    async remove(id: string): Promise<void> {
        const result = await this.citoyenModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Citoyen with ID ${id} not found`);
        }
    }

    async findByPhoneNumber(phoneNumber: string): Promise<Citoyen | null> {
        return this.citoyenModel
            .findOne({ phoneNumber }) 
            .exec();
    }

    async findByCNI(CNI: string): Promise<Citoyen | null> {
        return this.citoyenModel.findOne({ CNI }).exec();
    }

    async getList(
        range?: string,
        sort?: string,
        filter?: string,
    ): Promise<Citoyen[]> {
        const query = this.citoyenModel
            .find(JSON.parse(filter || '{}'))
            .select('-password');

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
        return this.citoyenModel
            .countDocuments(JSON.parse(filter || '{}'))
            .exec();
    }

    async getMany(filter: string): Promise<Citoyen[]> {
        const filterCriteria = filter ? JSON.parse(filter) : {};
        const ids = filterCriteria.id || [];

        return this.citoyenModel
            .find({ _id: { $in: ids } })
            .select('-password')
            .exec();
    }

    async getManyReference(filter: string): Promise<Citoyen[]> {
        const filterCriteria = filter ? JSON.parse(filter) : {};

        return this.citoyenModel
            .find(filterCriteria)
            .select('-password')
            .exec();
    }
}
