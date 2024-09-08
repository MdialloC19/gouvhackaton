import { Injectable, NotFoundException } from '@nestjs/common';
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
            .select('-password')
            .exec();
    }

    async findByCNI(CNI: string): Promise<Citoyen | null> {
        return this.citoyenModel.findOne({ CNI }).select('-password').exec();
    }
}
