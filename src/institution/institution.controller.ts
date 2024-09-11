import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    Query,
    Res,
    Logger,
} from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { ApiResponse } from '../interface/apiResponses.interface';
import { Institution } from './institution.schema';
import {
    ApiTags,
    ApiOperation,
    ApiResponse as SwaggerApiResponse,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { Citoyen } from 'src/citoyen/citoyen.schema';
import { Response } from 'express';

@ApiTags('Institutions')
@Controller('institutions')
export class InstitutionController {
    private readonly logger = new Logger(InstitutionController.name);
    constructor(private readonly institutionService: InstitutionService) {}

    // Admin
    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle institution' })
    @ApiBody({ type: CreateInstitutionDto })
    @SwaggerApiResponse({
        status: 201,
        description: 'Institution créée avec succès.',
        type: Institution,
    })
    @SwaggerApiResponse({
        status: 400,
        description: "Échec de la création de l'institution.",
    })
    async create(@Body() createInstitutionDto: CreateInstitutionDto) {
        try {
            const existingInstitution =
                await this.institutionService.findByName(
                    createInstitutionDto.name,
                );

            if (existingInstitution) {
                return {
                    status: 'error',
                    message: 'Institution avec ce nom existe déjà',
                    data: null,
                };
            }

            const createdInstitution =
                await this.institutionService.create(createInstitutionDto);
            const { _id, ...institutionWithoutId } = createdInstitution;
            const result = { id: _id.toString(), ...institutionWithoutId };
            return result;
        } catch (error) {
            throw new BadRequestException({
                status: 'error',
                message: "Échec de la création de l'institution",
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get()
    @ApiOperation({ summary: 'Obtenir la liste de toutes les institutions' })
    @SwaggerApiResponse({
        status: 200,
        description: 'Liste des institutions récupérée avec succès.',
        type: [Institution],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des institutions.',
    })
    async findAll(): Promise<ApiResponse<Institution[]>> {
        try {
            const institutions = await this.institutionService.findAll();
            return {
                status: 'success',
                message: 'Institutions récupérées avec succès',
                data: institutions,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des institutions',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get('domains')
    @ApiOperation({ summary: 'Obtenir la liste des domaines distincts' })
    @SwaggerApiResponse({
        status: 200,
        description: 'Domaines récupérés avec succès.',
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des domaines.',
    })
    async getDistinctDomains(): Promise<ApiResponse<any>> {
        try {
            const domains = await this.institutionService.getDistinctDomains();
            return {
                status: 'success',
                message: 'Domaines récupérés avec succès',
                data: domains,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des domaines',
                data: null,
            });
        }
    }

    @Get('list')
    @ApiOperation({
        summary: "Obtenir une liste d'institution avec pagination et tri",
    })
    @ApiQuery({
        name: 'range',
        required: false,
        description: 'Plage des institution à retourner',
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        description: 'Critère de tri des institution',
    })
    @ApiQuery({
        name: 'filter',
        required: false,
        description: 'Filtres à appliquer',
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Liste des institution récupérée avec succès.',
        type: [Institution],
    })
    async getList(
        @Res() response: Response,
        @Query('range') range?: string,
        @Query('sort') sort?: string,
        @Query('filter') filter?: string,
    ) {
        try {
            const args = {
                field: sort ? JSON.parse(sort)[0] : undefined,
                order: sort ? JSON.parse(sort)[1] : undefined,
                skip: range ? JSON.parse(range)[0] : undefined,
                take: range ? JSON.parse(range)[1] : undefined,
            };
            const institutions = await this.institutionService.getList(
                range,
                sort,
                filter,
            );
            const total = await this.institutionService.countFiltered(filter);
            const formattedInstitutions = institutions.map((institution) => ({
                ...institution.toObject(),
                id: institution._id.toString(),
            }));
            const institutionsWithoutId = formattedInstitutions.map(
                (institution) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { _id, ...rest } = institution;
                    return rest;
                },
            );
            if (args.order) {
                const length = institutions.length;
                response.set(
                    'Content-Range',
                    `institutions ${args.skip}-${args.skip + length}/${total}`,
                );
            }
            response.json(institutionsWithoutId);
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des institutions',
                data: null,
            });
        }
    }

    @Get('many')
    @ApiOperation({ summary: 'Obtenir plusieurs institution par leurs ID' })
    @ApiQuery({
        name: 'filter',
        description: 'Filtre basé sur les IDs',
        required: true,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'institution récupérés avec succès.',
        type: [Institution],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des institution.',
    })
    async getMany(@Res() response: Response, @Query('filter') filter: string) {
        try {
            const institutions = await this.institutionService.getMany(filter);

            const formattedInstitutions = institutions.map((institution) => ({
                ...institution.toObject(),
                id: institution._id.toString(),
            }));
            const institutionsWithoutId = formattedInstitutions.map(
                (institution) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { _id, ...rest } = institution;
                    return rest;
                },
            );
            response.json(institutionsWithoutId);
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des citoyens',
                data: null,
            });
        }
    }

    @Get('manyReference')
    @ApiOperation({ summary: 'Obtenir des institutions par référence' })
    @ApiQuery({
        name: 'filter',
        description: 'Filtre basé sur la référence (e.g. author_id)',
        required: true,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'institutions récupérés avec succès.',
        type: [Citoyen],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des institutions.',
    })
    async getManyReference(
        @Query('filter') filter: string,
    ): Promise<ApiResponse<Institution[]>> {
        try {
            const institutions =
                await this.institutionService.getManyReference(filter);
            return {
                status: 'success',
                message: 'institutions récupérés avec succès',
                data: institutions,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des institutions',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get(':id')
    @ApiOperation({ summary: 'Obtenir une institution par ID' })
    @ApiParam({ name: 'id', description: "ID de l'institution", type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Institution récupérée avec succès.',
        type: Institution,
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Institution non trouvée.',
    })
    async findOne(@Param('id') id: string) {
        try {
            const institution = await this.institutionService.findOne(id);
            if (!institution) {
                throw new NotFoundException(
                    `Institution with ID ${id} not found`,
                );
            }
            const formattedInstitution = institution.toObject();
            const { _id, ...institutionWithoutId } = formattedInstitution;
            const result = { id: _id.toString(), ...institutionWithoutId };
            return result;
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Institution avec l'ID ${id} non trouvée`,
                data: null,
            });
        }
    }

    // Admin
    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour une institution par ID' })
    @ApiParam({ name: 'id', description: "ID de l'institution", type: String })
    @ApiBody({ type: UpdateInstitutionDto })
    @SwaggerApiResponse({
        status: 200,
        description: 'Institution mise à jour avec succès.',
        type: Institution,
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Institution non trouvée.',
    })
    async update(
        @Param('id') id: string,
        @Body() updateInstitutionDto: UpdateInstitutionDto,
    ) {
        try {
            const updatedInstitution = await this.institutionService.update(
                id,
                updateInstitutionDto,
            );
            const { _id, ...institutionWithoutId } = updatedInstitution;
            const result = { id: _id.toString(), ...institutionWithoutId };
            return result;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(error);
            throw new InternalServerErrorException({
                status: 'error',
                message: `Échec de la mise à jour de l'institution ${id}`,
                data: null,
            });
        }
    }

    // Admin
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer une institution par ID' })
    @ApiParam({ name: 'id', description: "ID de l'institution", type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Institution supprimée avec succès.',
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Institution non trouvée.',
    })
    async remove(@Param('id') id: string): Promise<ApiResponse<Institution>> {
        try {
            await this.institutionService.remove(id);
            return {
                status: 'success',
                message: 'Institution supprimée avec succès',
                data: null,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Institution avec l'ID ${id} non trouvée`,
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get('getbydomain/:domain')
    @ApiOperation({ summary: 'Obtenir des institutions par domaine' })
    @ApiParam({
        name: 'domain',
        description: 'Domaine des institutions',
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description:
            'Institutions récupérées avec succès pour le domaine spécifié.',
        type: [Institution],
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Aucune institution trouvée pour le domaine spécifié.',
    })
    async findByDomain(
        @Param('domain') domain: string,
    ): Promise<ApiResponse<Institution[]>> {
        try {
            const institutions =
                await this.institutionService.findByDomain(domain);
            return {
                status: 'success',
                message: 'Institutions récupérées avec succès',
                data: institutions,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Aucune institution trouvée pour le domaine ${domain}`,
                data: null,
            });
        }
    }
}
