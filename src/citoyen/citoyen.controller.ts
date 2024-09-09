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
} from '@nestjs/common';
import { CitoyenService } from './citoyen.service';
import { CreateCitoyenDto } from './dto/create-citoyen.dto';
import { UpdateCitoyenDto } from './dto/update-citoyen.dto';
import { Citoyen } from './citoyen.schema';
import { ApiResponse } from '../interface/apiResponses.interface';
import {
    ApiTags,
    ApiOperation,
    ApiResponse as SwaggerApiResponse,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Citoyens')
@Controller('citoyens')
export class CitoyenController {
    constructor(private readonly citoyenService: CitoyenService) {}

    // Citoyen
    @Post()
    @ApiOperation({ summary: 'Créer un nouveau citoyen' })
    @ApiBody({ type: CreateCitoyenDto })
    @SwaggerApiResponse({
        status: 201,
        description: 'Citoyen créé avec succès.',
        type: Citoyen,
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la création du citoyen.',
    })
    async create(
        @Body() createCitoyenDto: CreateCitoyenDto,
    ): Promise<ApiResponse<Citoyen>> {
        try {
            const citoyen = await this.citoyenService.create(createCitoyenDto);
            return {
                status: 'success',
                message: 'Citoyen créé avec succès',
                data: citoyen,
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la création du citoyen',
                data: null,
            });
        }
    }

    
    // Citoyen, Fonctionnaire, Admin
    @Get('phone')
    @ApiOperation({ summary: 'Obtenir un citoyen par numéro de téléphone' })
    @ApiQuery({
        name: 'phoneNumber',
        description: 'Numéro de téléphone du citoyen',
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Citoyen récupéré avec succès.',
        type: Citoyen,
    })
    @SwaggerApiResponse({ status: 404, description: 'Citoyen non trouvé.' })
    @SwaggerApiResponse({
        status: 500,
        description:
            'Échec de la récupération du citoyen par numéro de téléphone.',
    })
    async findByPhoneNumber(
        @Query('phoneNumber') phoneNumber: string,
    ): Promise<ApiResponse<Citoyen | null>> {
        try {
            const citoyen =
                await this.citoyenService.findByPhoneNumber(phoneNumber);
            return {
                status: 'success',
                message: 'Citoyen récupéré avec succès',
                data: citoyen,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message:
                    'Échec de la récupération du citoyen par numéro de téléphone',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get('cni')
    @ApiOperation({ summary: 'Obtenir un citoyen par CNI' })
    @ApiQuery({ name: 'CNI', description: 'CNI du citoyen', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Citoyen récupéré avec succès.',
        type: Citoyen,
    })
    @SwaggerApiResponse({ status: 404, description: 'Citoyen non trouvé.' })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération du citoyen par CNI.',
    })
    async findByCNI(
        @Query('CNI') CNI: string,
    ): Promise<ApiResponse<Citoyen | null>> {
        try {
            const citoyen = await this.citoyenService.findByCNI(CNI);
            return {
                status: 'success',
                message: 'Citoyen récupéré avec succès',
                data: citoyen,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération du citoyen par CNI',
                data: null,
            });
        }
    }

    @Get('list')
    @ApiOperation({
        summary: 'Obtenir une liste de citoyens avec pagination et tri',
    })
    @ApiQuery({
        name: 'range',
        required: false,
        description: 'Plage des citoyens à retourner',
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        description: 'Critère de tri des citoyens',
    })
    @ApiQuery({
        name: 'filter',
        required: false,
        description: 'Filtres à appliquer',
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Liste des citoyens récupérée avec succès.',
        type: [Citoyen],
    })
    async getList(
        @Query('range') range?: string,
        @Query('sort') sort?: string,
        @Query('filter') filter?: string,
    ): Promise<{ data: Citoyen[]; total: number }> {
        const citoyens = await this.citoyenService.getList(range, sort, filter);
        const total = await this.citoyenService.countFiltered(filter);
        return { data: citoyens, total };
    }

    @Get('many')
    @ApiOperation({ summary: 'Obtenir plusieurs citoyens par leurs ID' })
    @ApiQuery({
        name: 'filter',
        description: 'Filtre basé sur les IDs',
        required: true,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Citoyens récupérés avec succès.',
        type: [Citoyen],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des citoyens.',
    })
    async getMany(
        @Query('filter') filter: string,
    ): Promise<ApiResponse<Citoyen[]>> {
        try {
            const citoyens = await this.citoyenService.getMany(filter);
            return {
                status: 'success',
                message: 'Citoyens récupérés avec succès',
                data: citoyens,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des citoyens',
                data: null,
            });
        }
    }

    @Get('manyReference')
    @ApiOperation({ summary: 'Obtenir des citoyens par référence' })
    @ApiQuery({
        name: 'filter',
        description: 'Filtre basé sur la référence (e.g. author_id)',
        required: true,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Citoyens récupérés avec succès.',
        type: [Citoyen],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des citoyens.',
    })
    async getManyReference(
        @Query('filter') filter: string,
    ): Promise<ApiResponse<Citoyen[]>> {
        try {
            const citoyens = await this.citoyenService.getManyReference(filter);
            return {
                status: 'success',
                message: 'Citoyens récupérés avec succès',
                data: citoyens,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des citoyens',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get()
    @ApiOperation({ summary: 'Obtenir tous les citoyens' })
    @SwaggerApiResponse({
        status: 200,
        description: 'Citoyens récupérés avec succès.',
        type: [Citoyen],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des citoyens.',
    })
    async findAll(): Promise<ApiResponse<Citoyen[]>> {
        try {
            const citoyens = await this.citoyenService.findAll();
            return {
                status: 'success',
                message: 'Citoyens récupérés avec succès',
                data: citoyens,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des citoyens',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un citoyen par ID' })
    @ApiParam({ name: 'id', description: 'ID du citoyen', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Citoyen récupéré avec succès.',
        type: Citoyen,
    })
    @SwaggerApiResponse({ status: 404, description: 'Citoyen non trouvé.' })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération du citoyen.',
    })
    async findOne(@Param('id') id: string): Promise<ApiResponse<Citoyen>> {
        try {
            const citoyen = await this.citoyenService.findOne(id);
            return {
                status: 'success',
                message: 'Citoyen récupéré avec succès',
                data: citoyen,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération du citoyen',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour un citoyen par ID' })
    @ApiParam({ name: 'id', description: 'ID du citoyen', type: String })
    @ApiBody({ type: UpdateCitoyenDto })
    @SwaggerApiResponse({
        status: 200,
        description: 'Citoyen mis à jour avec succès.',
        type: Citoyen,
    })
    @SwaggerApiResponse({ status: 404, description: 'Citoyen non trouvé.' })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la mise à jour du citoyen.',
    })
    async update(
        @Param('id') id: string,
        @Body() updateCitoyenDto: UpdateCitoyenDto,
    ): Promise<ApiResponse<Citoyen>> {
        try {
            const updatedCitoyen = await this.citoyenService.update(
                id,
                updateCitoyenDto,
            );
            return {
                status: 'success',
                message: 'Citoyen mis à jour avec succès',
                data: updatedCitoyen,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la mise à jour du citoyen',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un citoyen par ID' })
    @ApiParam({ name: 'id', description: 'ID du citoyen', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Citoyen supprimé avec succès.',
    })
    @SwaggerApiResponse({ status: 404, description: 'Citoyen non trouvé.' })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la suppression du citoyen.',
    })
    async remove(@Param('id') id: string): Promise<ApiResponse<void>> {
        try {
            await this.citoyenService.remove(id);
            return {
                status: 'success',
                message: 'Citoyen supprimé avec succès',
                data: null,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la suppression du citoyen',
                data: null,
            });
        }
    }

}
