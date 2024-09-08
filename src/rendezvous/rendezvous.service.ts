import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CitoyenService } from 'src/citoyen/citoyen.service';
import { InstitutionService } from 'src/institution/institution.service';
import { CreateRendezvousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezvousDto } from './dto/update-rendezvous.dto';
import { Rendezvous } from './rendezvous.schema';

@Injectable()
export class RendezvousService {
    constructor(
        @InjectModel(Rendezvous.name)
        private readonly rendezvousModel: Model<Rendezvous>,
        private readonly citoyenService: CitoyenService,
        private readonly institutionService: InstitutionService,
    ) {}

    async create(
        createRendezvousDto: CreateRendezvousDto,
    ): Promise<Rendezvous> {
        const citoyen = await this.citoyenService.findOne(
            createRendezvousDto.citoyen.toString(),
        );
        const institution = await this.institutionService.findOne(
            createRendezvousDto.institution.toString(),
        );

        if (!citoyen || !institution) {
            throw new BadRequestException('Citoyen or Institution not found');
        }

        const createdRendezvous = new this.rendezvousModel({
            ...createRendezvousDto,
            citoyen: citoyen._id,
            institution: institution._id,
        });

        return createdRendezvous.save();
    }

    async findAll(): Promise<Rendezvous[]> {
        return this.rendezvousModel
            .find()
            .populate('citoyen institution')
            .exec();
    }

    async findOne(id: string): Promise<Rendezvous> {
        const rendezvous = await this.rendezvousModel
            .findById(id)
            .populate('citoyen institution')
            .exec();
        if (!rendezvous) {
            throw new NotFoundException('Rendezvous not found');
        }
        return rendezvous;
    }

    async findByInstitution(institutionId: string): Promise<Rendezvous[]> {
        const institution =
            await this.institutionService.findOne(institutionId);
        if (!institution) {
            throw new NotFoundException('Institution not found');
        }
        const rendezvous = await this.rendezvousModel
            .find({ institution: institutionId })
            .populate('citoyen institution')
            .exec();

        if (rendezvous.length === 0) {
            throw new NotFoundException(
                'No rendezvous found for this institution',
            );
        }
        return rendezvous;
    }

    async findByCitoyen(citoyenId: string): Promise<Rendezvous[]> {
        const citoyen = await this.citoyenService.findOne(citoyenId);
        if (!citoyen) {
            throw new NotFoundException('Citoyen not found');
        }
        const rendezvous = await this.rendezvousModel
            .find({ citoyen: citoyenId })
            .populate('citoyen institution')
            .exec();

        if (rendezvous.length === 0) {
            throw new NotFoundException('No rendezvous found for this citoyen');
        }
        return rendezvous;
    }

    async update(
        id: string,
        updateRendezvousDto: UpdateRendezvousDto,
    ): Promise<Rendezvous> {
        const rendezvous = await this.rendezvousModel.findById(id);
        if (!rendezvous) {
            throw new NotFoundException('Rendezvous not found');
        }

        if (updateRendezvousDto.citoyen) {
            const citoyen = await this.citoyenService.findOne(
                updateRendezvousDto.citoyen.toString(),
            );
            if (!citoyen) {
                throw new BadRequestException('Citoyen not found');
            }
            rendezvous.citoyen = citoyen;
        }

        if (updateRendezvousDto.institution) {
            const institution = await this.institutionService.findOne(
                updateRendezvousDto.institution.toString(),
            );
            if (!institution) {
                throw new BadRequestException('Institution not found');
            }
            rendezvous.institution = institution;
        }

        Object.assign(rendezvous, updateRendezvousDto);
        return rendezvous.save();
    }

    async delete(id: string): Promise<void> {
        const result = await this.rendezvousModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('Rendezvous not found');
        }
    }
}
