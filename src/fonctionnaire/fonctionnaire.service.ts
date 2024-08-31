import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fonctionnaire } from './fonctionnaire.schema';
import { CreateFonctionnaireDto } from './dto/create-fonctionnaire.dto';
import { UpdateFonctionnaireDto } from './dto/update-fonctionnaire.dto';
import { InstitutionService } from '../institution/institution.service';

@Injectable()
export class FonctionnaireService {
    constructor(
        @InjectModel(Fonctionnaire.name)
        private readonly fonctionnaireModel: Model<Fonctionnaire>,
        private readonly institutionService: InstitutionService,
    ) {}
    async create(
        createFonctionnaireDto: CreateFonctionnaireDto,
    ): Promise<Fonctionnaire> {
        const { institutionName, ...rest } = createFonctionnaireDto;
        const institution =
            await this.institutionService.findByName(institutionName);
        if (!institution) {
            throw new NotFoundException(
                `Institution with name ${institutionName} not found`,
            );
        }

        const fonctionnaire = new this.fonctionnaireModel({
            ...rest,
            institution: institution._id,
        });
        return fonctionnaire.save();
    }

    async findAll(): Promise<Fonctionnaire[]> {
        return this.fonctionnaireModel.find().populate('institution').exec();
    }

    async findOne(id: string): Promise<Fonctionnaire> {
        const fonctionnaire = await this.fonctionnaireModel
            .findById(id)
            .populate('institution')
            .exec();
        if (!fonctionnaire) {
            throw new NotFoundException(
                `Fonctionnaire with ID "${id}" not found`,
            );
        }
        return fonctionnaire;
    }

    async update(
        id: string,
        updateFonctionnaireDto: UpdateFonctionnaireDto,
    ): Promise<Fonctionnaire> {
        const updatedFonctionnaire = await this.fonctionnaireModel
            .findByIdAndUpdate(id, updateFonctionnaireDto, {
                new: true,
            })
            .exec();
        if (!updatedFonctionnaire) {
            throw new NotFoundException(
                `Fonctionnaire with ID "${id}" not found`,
            );
        }
        return updatedFonctionnaire;
    }

    async remove(id: string): Promise<Fonctionnaire> {
        const deletedFonctionnaire = await this.fonctionnaireModel
            .findByIdAndDelete(id)
            .exec();
        if (!deletedFonctionnaire) {
            throw new NotFoundException(
                `Fonctionnaire with ID "${id}" not found`,
            );
        }
        return deletedFonctionnaire;
    }
}
