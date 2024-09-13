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
import { FonctionnaireService } from 'src/fonctionnaire/fonctionnaire.service';

@Injectable()
export class RendezvousService {
    constructor(
        @InjectModel(Rendezvous.name)
        private readonly rendezvousModel: Model<Rendezvous>,
        private readonly citoyenService: CitoyenService,
        private readonly institutionService: InstitutionService,
        private readonly fonctionnaireService: FonctionnaireService,

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
        try {
            const rendezvous = await this.rendezvousModel
                .find()
                .populate('citoyen institution')
                .exec();

            if (!rendezvous || rendezvous.length === 0) {
                throw new NotFoundException('Rendezvous not found');
            }

            return rendezvous;
        } catch (error) {
            console.log(error);
            throw new Error(`Failed to retrieve rendezvous: ${error.message}`);
        }
    }
    async findByServiceAndStatus(
        fonctionnaireId: string,
        status?: string,
        page: number = 1,  
        limit: number = 20 ,
        sort?: string,
        filter?: string,
    ){
        const fonctionnaire = await this.fonctionnaireService.findOne(fonctionnaireId);
        if (!fonctionnaire) {
            throw new NotFoundException(`Fonctionnaire with ID ${fonctionnaireId} not found.`);
        }
    
    
        const sortFields = {};

        if (sort) {
            const sortArray = sort.split(',');
            sortArray.forEach(field => {
                const direction = field.startsWith('-') ? -1 : 1;
                const fieldName = field.substring(1) ;
                sortFields[fieldName] = direction ;
            });
        } else {
            sortFields['createdAt'] = 1;
        }
         
        const query = this.rendezvousModel.find({
            institution: fonctionnaire.institution._id.toString(),
        });
    
        if (status) {
            query.where({ state: status });
        }
    
        if (filter) {
            query.where(JSON.parse(filter));
        }
    
        const totalCount = await this.rendezvousModel.countDocuments({
            institution: fonctionnaire.institution._id.toString(),
            ...(status ? { state: status } : {}),
            ...(filter ? JSON.parse(filter) : {}),
        }).exec();
    
        const rendezvous = await query
            .skip((page - 1) * limit) 
            .limit(limit)
            .sort(sortFields)
            .populate('service institution processedBy citoyen')
            .exec();
    
        if (!rendezvous || rendezvous.length === 0) {
            throw new NotFoundException(`No rendezvous found `);
        }
    
        return {
            status: 'success',
            message: 'rendezvous retrieved successfully',
            data: rendezvous,
            metadata: {
                total_count: totalCount,
            },
        };
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
