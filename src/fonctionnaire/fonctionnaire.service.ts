import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fonctionnaire } from './fonctionnaire.schema';
import { CreateFonctionnaireDto } from './dto/create-fonctionnaire.dto';
import { UpdateFonctionnaireDto } from './dto/update-fonctionnaire.dto';
import { InstitutionService } from '../institution/institution.service';
import { ServiceService } from 'src/service/service.service';
import { Service } from 'src/service/service.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FonctionnaireService {
    constructor(
        @InjectModel(Fonctionnaire.name)
        private readonly fonctionnaireModel: Model<Fonctionnaire>,
        private readonly institutionService: InstitutionService,
        private readonly serviceService: ServiceService,
    ) {}

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
      }

    async create(
        createFonctionnaireDto: CreateFonctionnaireDto,
    ): Promise<Fonctionnaire> {
        const {
            institutionId,
            CNI,
            phoneNumber,
            email,
            idNumber,
            birthDate,
            password,
            ...rest
        } = createFonctionnaireDto;

        const hashedPassword = await this.hashPassword(password);
        

        const institution =
            await this.institutionService.findOne(institutionId);
        if (!institution) {
            throw new NotFoundException(
                `Institution with Id ${institutionId} not found`,
            );
        }

        const existingCni = await this.fonctionnaireModel
            .findOne({ CNI })
            .exec();
        if (existingCni) {
            throw new ConflictException('CNI already exists');
        }

        const existingPhoneNumber = await this.fonctionnaireModel
            .findOne({ phoneNumber })
            .exec();
        if (existingPhoneNumber) {
            throw new ConflictException('Phone number already exists');
        }

        const existingEmail = await this.fonctionnaireModel
            .findOne({ email })
            .exec();
        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        const existingIdNumber = await this.fonctionnaireModel
            .findOne({ idNumber })
            .exec();
        if (existingIdNumber) {
            throw new ConflictException('ID number already exists');
        }
        const fonctionnaire = new this.fonctionnaireModel({
            CNI,
            phoneNumber,
            email,
            idNumber,
            institution: institution._id,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            password: hashedPassword,
            ...rest,
        });

        try {
            return await fonctionnaire.save();
        } catch (error) {
            throw error;
        }
    }

    async findAll(): Promise<Fonctionnaire[]> {
        return this.fonctionnaireModel
            .find()
            .populate('institution')
            .select('-password')
            .exec();
    }

    async findOne(id: string): Promise<Fonctionnaire> {
        const fonctionnaire = await this.fonctionnaireModel
            .findById(id)
            .populate('institution')
            .select('-password')
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
            .select('-password')
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
    async findByEmail(email: string): Promise<Fonctionnaire> {
        return  this.fonctionnaireModel
            .findOne({ email })
            .populate('institution')
            .exec();
        // if (!fonctionnaire) {
        //     throw new NotFoundException(
        //         `Fonctionnaire with email "${email}" not found`,
        //     );
        // }
       
    }

    async findByIdNumber(idNumber: string): Promise<Fonctionnaire> {
        const fonctionnaire = await this.fonctionnaireModel
            .findOne({ idNumber })
            .populate('institution')
            .select('-password')
            .exec();
        if (!fonctionnaire) {
            throw new NotFoundException(
                `Fonctionnaire with ID number "${idNumber}" not found`,
            );
        }
        return fonctionnaire;
    }

    async findByInstitution(institutionId: string): Promise<Fonctionnaire[]> {
        const fonctionnaires = await this.fonctionnaireModel
            .find({ institution: institutionId })
            .populate('institution')
            .select('-password')
            .exec();
        if (fonctionnaires.length === 0) {
            throw new NotFoundException(
                `No fonctionnaires found for institution ID "${institutionId}"`,
            );
        }
        return fonctionnaires;
    }

    async findByCNI(CNI: string): Promise<Fonctionnaire> {
        const fonctionnaire = await this.fonctionnaireModel
            .findOne({ CNI })
            .populate('institution')
            .select('-password')
            .exec();
        if (!fonctionnaire) {
            throw new NotFoundException(
                `Fonctionnaire with CNI "${CNI}" not found`,
            );
        }
        return fonctionnaire;
    }

    async getList(
        range?: string,
        sort?: string,
        filter?: string,
    ): Promise<Fonctionnaire[]> {
        const query = this.fonctionnaireModel
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

        return query.populate('institution').exec();
    }

    async countFiltered(filter?: string): Promise<number> {
        return this.fonctionnaireModel
            .countDocuments(JSON.parse(filter || '{}'))
            .exec();
    }

    async getMany(filter: string): Promise<Fonctionnaire[]> {
        const filterCriteria = filter ? JSON.parse(filter) : {};
        const ids = filterCriteria.id || [];

        return this.fonctionnaireModel
            .find({ _id: { $in: ids } })
            .populate('institution')
            .select('-password')
            .exec();
    }

    async getManyReference(filter: string): Promise<Fonctionnaire[]> {
        const filterCriteria = filter ? JSON.parse(filter) : {};

        return this.fonctionnaireModel
            .find(filterCriteria)
            .populate('institution')
            .select('-password')
            .exec();
    }

    async getServiceForFonctionnaire(
        fonctionnaireId: string,
    ): Promise<Service[]> {
        const fonctionnaire = await this.fonctionnaireModel
            .findOne({ _id: fonctionnaireId })
            .populate('institution')
            .exec();
        if (!fonctionnaire) {
            throw new NotFoundException(
                `Fonctionnaire with ID ${fonctionnaireId} not found.`,
            );
        }

        const fonctionnaireInstitutionId = fonctionnaire.institution;

        const services = this.serviceService.findByInstitution(
            fonctionnaireInstitutionId.toString(),
        );
        if (!services || (await services).length === 0) {
            throw new NotFoundException(
                `No services found for institution with ID ${fonctionnaireInstitutionId}`,
            );
        }

        return services;
    }
}
