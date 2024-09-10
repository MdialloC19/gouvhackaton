import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    NotFoundException,
    InternalServerErrorException,
    ConflictException,
    Res,
} from '@nestjs/common';
import { FonctionnaireService } from './fonctionnaire.service';
import { CreateFonctionnaireDto } from './dto/create-fonctionnaire.dto';
import { UpdateFonctionnaireDto } from './dto/update-fonctionnaire.dto';
import { Fonctionnaire } from './fonctionnaire.schema';
import { ApiResponse } from '../interface/apiResponses.interface';
import {
    ApiTags,
    ApiOperation,
    ApiResponse as SwaggerApiResponse,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { Response } from 'express';

@ApiTags('Fonctionnaires')
@Controller('fonctionnaires')
export class FonctionnaireController {
    private readonly logger = new Logger(FonctionnaireController.name);
    constructor(private readonly fonctionnaireService: FonctionnaireService) {}

    // Admin
    @Post()
    @ApiOperation({ summary: 'Créer un nouveau fonctionnaire' })
    @ApiBody({ type: CreateFonctionnaireDto })
    @SwaggerApiResponse({
        status: 201,
        description: 'Fonctionnaire créé avec succès.',
        type: Fonctionnaire,
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la création du fonctionnaire.',
    })
    async create(@Body() createFonctionnaireDto: CreateFonctionnaireDto) {
        try {
            const fonctionnaire = await this.fonctionnaireService.create(
                createFonctionnaireDto,
            );
            // Align w/ react admin requirements (it does not support _id so replace it with id)
            const { _id, ...fonctionnaireWithoutId } = fonctionnaire;
            const result = { id: _id.toString(), ...fonctionnaireWithoutId };

            return result;
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            } else
                throw new InternalServerErrorException({
                    status: 'error',
                    message: 'Échec de la création du fonctionnaire',
                    data: null,
                });
        }
    }

    // Fonctionnaire, Admin
    @Get()
    @ApiOperation({ summary: 'Obtenir la liste de tous les fonctionnaires' })
    @SwaggerApiResponse({
        status: 200,
        description: 'Fonctionnaires récupérés avec succès.',
        type: [Fonctionnaire],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des fonctionnaires.',
    })
    async findAll(): Promise<ApiResponse<Fonctionnaire[] | null>> {
        try {
            const fonctionnaires = await this.fonctionnaireService.findAll();
            return {
                status: 'success',
                message: 'Fonctionnaires récupérés avec succès',
                data: fonctionnaires,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des fonctionnaires',
                data: null,
            });
        }
    }
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un fonctionnaire par ID' })
    @ApiParam({ name: 'id', description: 'ID du fonctionnaire', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Fonctionnaire supprimé avec succès.',
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Fonctionnaire non trouvé.',
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la suppression du fonctionnaire.',
    })
    async remove(
        @Param('id') id: string,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const deletedFonctionnaire =
                await this.fonctionnaireService.remove(id);
            return {
                status: 'success',
                message: 'Fonctionnaire supprimé avec succès',
                data: deletedFonctionnaire,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la suppression du fonctionnaire',
                data: null,
            });
        }
    }

    @Get('list')
    @ApiOperation({
        summary: 'Obtenir une liste de fonctionnaires avec pagination et tri',
    })
    @ApiQuery({
        name: 'range',
        required: false,
        description: 'Plage des fonctionnaires à retourner',
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        description: 'Critère de tri des fonctionnaires',
    })
    @ApiQuery({
        name: 'filter',
        required: false,
        description: 'Filtres à appliquer',
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Liste des fonctionnaires récupérée avec succès.',
        type: [Fonctionnaire],
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

            const fonctionnaires = await this.fonctionnaireService.getList(
                range,
                sort,
                filter,
            );
            const total = await this.fonctionnaireService.countFiltered(filter);
            const formattedFonctionnaires = fonctionnaires.map(
                (fonctionnaire) => ({
                    ...fonctionnaire.toObject(),
                    id: fonctionnaire._id.toString(),
                }),
            );
            const fonctionnairesWithoutId = formattedFonctionnaires.map(
                (fonctionnaire) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { _id, ...rest } = fonctionnaire;
                    return rest;
                },
            );
            if (args.order) {
                const length = fonctionnaires.length;
                response.set(
                    'Content-Range',
                    `fonctionnaires ${args.skip}-${args.skip + length}/${total}`,
                );
            }
            response.json(fonctionnairesWithoutId);
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des fonctionnaires',
                data: null,
            });
        }
    }

    // Admin
    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour un fonctionnaire par ID' })
    @ApiParam({ name: 'id', description: 'ID du fonctionnaire', type: String })
    @ApiBody({ type: UpdateFonctionnaireDto })
    @SwaggerApiResponse({
        status: 200,
        description: 'Fonctionnaire mis à jour avec succès.',
        type: Fonctionnaire,
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Fonctionnaire non trouvé.',
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la mise à jour du fonctionnaire.',
    })
    async update(
        @Param('id') id: string,
        @Body() updateFonctionnaireDto: UpdateFonctionnaireDto,
    ) {
        try {
            const updatedFonctionnaire = await this.fonctionnaireService.update(
                id,
                updateFonctionnaireDto,
            );
            const { _id, ...fonctionnaireWithoutId } = updatedFonctionnaire;
            const result = { id: _id.toString(), ...fonctionnaireWithoutId };
            return result;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(error);
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la mise à jour du fonctionnaire',
                data: null,
            });
        }
    }

    // Admin
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un fonctionnaire par ID' })
    @ApiParam({ name: 'id', description: 'ID du fonctionnaire', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Fonctionnaire supprimé avec succès.',
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Fonctionnaire non trouvé.',
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la suppression du fonctionnaire.',
    })

    // Fonctionnaire, Admin
    @Get('email')
    @ApiOperation({ summary: 'Obtenir un fonctionnaire par email' })
    @ApiQuery({
        name: 'email',
        description: 'Email du fonctionnaire',
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Fonctionnaire récupéré avec succès par email.',
        type: Fonctionnaire,
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération du fonctionnaire par email.',
    })
    async findByEmail(
        @Query('email') email: string,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const fonctionnaire =
                await this.fonctionnaireService.findByEmail(email);
            return {
                status: 'success',
                message: 'Fonctionnaire récupéré avec succès',
                data: fonctionnaire,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération du fonctionnaire par email',
                data: null,
            });
        }
    }

    // Fonctionnaire, Admin
    @Get('idnumber')
    @ApiOperation({
        summary: "Obtenir un fonctionnaire par numéro d'identification",
    })
    @ApiQuery({
        name: 'idNumber',
        description: "Numéro d'identification du fonctionnaire",
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description:
            "Fonctionnaire récupéré avec succès par numéro d'identification.",
        type: Fonctionnaire,
    })
    @SwaggerApiResponse({
        status: 500,
        description:
            "Échec de la récupération du fonctionnaire par numéro d'identification.",
    })
    async findByIdNumber(
        @Query('idNumber') idNumber: string,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const fonctionnaire =
                await this.fonctionnaireService.findByIdNumber(idNumber);
            return {
                status: 'success',
                message: 'Fonctionnaire récupéré avec succès',
                data: fonctionnaire,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message:
                    "Échec de la récupération du fonctionnaire par numéro d'identification",
                data: null,
            });
        }
    }

    // Fonctionnaire, Admin
    @Get('institution')
    @ApiOperation({
        summary: "Obtenir les fonctionnaires par ID d'institution",
    })
    @ApiQuery({
        name: 'institutionId',
        description: "ID de l'institution",
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description:
            "Fonctionnaires récupérés avec succès pour l'institution spécifiée.",
        type: [Fonctionnaire],
    })
    @SwaggerApiResponse({
        status: 500,
        description:
            'Échec de la récupération des fonctionnaires par institution.',
    })
    async findByInstitution(
        @Query('institutionId') institutionId: string,
    ): Promise<ApiResponse<Fonctionnaire[] | null>> {
        try {
            const fonctionnaires =
                await this.fonctionnaireService.findByInstitution(
                    institutionId,
                );
            return {
                status: 'success',
                message: 'Fonctionnaires récupérés avec succès',
                data: fonctionnaires,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message:
                    'Échec de la récupération des fonctionnaires par institution',
                data: null,
            });
        }
    }

    // Fonctionnaire, Admin
    @Get('cni')
    @ApiOperation({ summary: 'Obtenir un fonctionnaire par CNI' })
    @ApiQuery({
        name: 'CNI',
        description: 'CNI du fonctionnaire',
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Fonctionnaire récupéré avec succès par CNI.',
        type: Fonctionnaire,
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération du fonctionnaire par CNI.',
    })
    async findByCNI(
        @Query('CNI') CNI: string,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const fonctionnaire =
                await this.fonctionnaireService.findByCNI(CNI);
            return {
                status: 'success',
                message: 'Fonctionnaire récupéré avec succès',
                data: fonctionnaire,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération du fonctionnaire par CNI',
                data: null,
            });
        }
    }

    @Get('many')
    @ApiOperation({ summary: 'Obtenir plusieurs fonctionnaires par leurs ID' })
    @ApiQuery({
        name: 'filter',
        description: 'Filtre basé sur les IDs',
        required: true,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'fonctionnaires récupérés avec succès.',
        type: [Fonctionnaire],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des fonctionnaires.',
    })
    async getMany(
        @Query('filter') filter: string,
    ): Promise<ApiResponse<Fonctionnaire[]>> {
        try {
            const fonctionnaires =
                await this.fonctionnaireService.getMany(filter);
            return {
                status: 'success',
                message: 'fonctionnaires récupérés avec succès',
                data: fonctionnaires,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des fonctionnaires',
                data: null,
            });
        }
    }

    @Get('manyReference')
    @ApiOperation({ summary: 'Obtenir des fonctionnaires par référence' })
    @ApiQuery({
        name: 'filter',
        description: 'Filtre basé sur la référence (e.g. author_id)',
        required: true,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'fonctionnaires récupérés avec succès.',
        type: [Fonctionnaire],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des fonctionnaires.',
    })
    async getManyReference(
        @Query('filter') filter: string,
    ): Promise<ApiResponse<Fonctionnaire[]>> {
        try {
            const fonctionnaires =
                await this.fonctionnaireService.getManyReference(filter);
            return {
                status: 'success',
                message: 'fonctionnaires récupérés avec succès',
                data: fonctionnaires,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des fonctionnaires',
                data: null,
            });
        }
    }

    // Fonctionnaire, Admin
    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un fonctionnaire par ID' })
    @ApiParam({ name: 'id', description: 'ID du fonctionnaire', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Fonctionnaire récupéré avec succès.',
        type: Fonctionnaire,
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Fonctionnaire non trouvé.',
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération du fonctionnaire.',
    })
    async findOne(@Param('id') id: string) {
        try {
            const fonctionnaire = await this.fonctionnaireService.findOne(id);

            if (!fonctionnaire) {
                throw new NotFoundException(
                    `Fonctionnaire with ID ${id} not found`,
                );
            }

            const formattedFonctionnaire = fonctionnaire.toObject();

            // Map `_id` to `id` and remove `_id`
            const { _id, ...fonctionnaireWithoutId } = formattedFonctionnaire;
            const result = { id: _id.toString(), ...fonctionnaireWithoutId };
            return result;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération du fonctionnaire',
                data: null,
            });
        }
    }
}
