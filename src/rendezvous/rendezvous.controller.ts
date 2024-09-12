import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    NotFoundException,
    BadRequestException,
    Query,
} from '@nestjs/common';
import { RendezvousService } from './rendezvous.service';
import { CreateRendezvousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezvousDto } from './dto/update-rendezvous.dto';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiParam,
    ApiResponse as SwaggerApiResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { ApiResponse } from 'src/interface/apiResponses.interface';

@ApiTags('Rendezvous')
@Controller('rendezvous')
export class RendezvousController {
    constructor(private readonly rendezvousService: RendezvousService) {}

    @Post()
    @ApiOperation({ summary: 'Créer un nouveau rendez-vous' })
    @ApiBody({ type: CreateRendezvousDto })
    @SwaggerApiResponse({
        status: 201,
        description: 'Rendez-vous créé avec succès.',
        type: CreateRendezvousDto,
    })
    @SwaggerApiResponse({
        status: 400,
        description: 'Échec de la création du rendez-vous.',
    })
    async create(@Body() createRendezvousDto: CreateRendezvousDto) {
        try {
            const rendezvous =
                await this.rendezvousService.create(createRendezvousDto);
            return {
                statusCode: 201,
                message: 'Rendezvous created successfully',
                data: rendezvous,
            };
        } catch (error) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Failed to create rendezvous',
                data: null,
            });
        }
    }

    @Get()
    @ApiOperation({ summary: 'Obtenir tous les rendez-vous' })
    @SwaggerApiResponse({
        status: 200,
        description: 'Rendez-vous récupérés avec succès.',
        type: [CreateRendezvousDto],
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Échec de la récupération des rendez-vous.',
    })
    async findAll() {
        try {
            const rendezvousList = await this.rendezvousService.findAll();
            return {
                statusCode: 200,
                message: 'Rendezvous retrieved successfully',
                data: rendezvousList,
            };
        } catch (error) {
            throw new NotFoundException({
                statusCode: 404,
                message: 'Failed to retrieve rendezvous',
                data: null,
            });
        }
    }
    @Get('fonctionnaire/:fonctionnaireId')
    @ApiOperation({
        summary: 'Obtenir les rendez-vous pour un fonctionnaire avec des options de pagination, de tri et de filtrage',
    })
    @ApiParam({
        name: 'fonctionnaireId',
        description: 'ID du fonctionnaire',
        type: String,
    })
    @ApiQuery({
        name: 'status',
        description: 'Filtrer par état du rendez-vous',
        required: false,
    })
    @ApiQuery({
        name: 'page',
        description: 'Numéro de la page pour la pagination',
        required: false,
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        description: 'Nombre de rendez-vous par page',
        required: false,
        example: 20,
    })
    @ApiQuery({
        name: 'sort',
        description: 'Critères de tri des résultats, ex: "+field,-field"',
        required: false,
    })
    @ApiQuery({
        name: 'filter',
        description: 'Critères de filtrage supplémentaires en JSON',
        required: false,
    })
    async findByServiceAndStatus(
        @Param('fonctionnaireId') fonctionnaireId: string,
        @Query('status') status?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @Query('sort') sort?: string,
        @Query('filter') filter?: string,
    ): Promise<ApiResponse<any>> {
        try {
            const result = await this.rendezvousService.findByServiceAndStatus(
                fonctionnaireId,
                status,
                page,
                limit,
                sort,
                filter,
            );
            return result;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            throw new BadRequestException({
                status: 'error',
                message: 'An unexpected error occurred',
                data: null,
            });
        }
    }

    @Get('institution/:institutionId')
    @ApiOperation({ summary: 'Obtenir les rendez-vous par institution' })
    @ApiParam({
        name: 'institutionId',
        description: "ID de l'institution",
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description: "Rendez-vous récupérés pour l'institution avec succès.",
        type: [CreateRendezvousDto],
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Aucun rendez-vous trouvé pour cette institution.',
    })
    async findByInstitution(@Param('institutionId') institutionId: string) {
        try {
            const rendezvous =
                await this.rendezvousService.findByInstitution(institutionId);
            return {
                statusCode: 200,
                message: 'Rendezvous retrieved successfully by institution',
                data: rendezvous,
            };
        } catch (error) {
            throw new NotFoundException({
                statusCode: 404,
                message: `No rendezvous found for institution with ID ${institutionId}`,
                data: null,
            });
        }
    }

    @Get('citoyen/:citoyenId')
    @ApiOperation({ summary: 'Obtenir les rendez-vous par citoyen' })
    @ApiParam({ name: 'citoyenId', description: 'ID du citoyen', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Rendez-vous récupérés pour le citoyen avec succès.',
        type: [CreateRendezvousDto],
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Aucun rendez-vous trouvé pour ce citoyen.',
    })
    async findByCitoyen(@Param('citoyenId') citoyenId: string) {
        try {
            const rendezvous =
                await this.rendezvousService.findByCitoyen(citoyenId);
            return {
                statusCode: 200,
                message: 'Rendezvous retrieved successfully by citoyen',
                data: rendezvous,
            };
        } catch (error) {
            throw new NotFoundException({
                statusCode: 404,
                message: `No rendezvous found for citoyen with ID ${citoyenId}`,
                data: null,
            });
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un rendez-vous par ID' })
    @ApiParam({ name: 'id', description: 'ID du rendez-vous', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Rendez-vous récupéré avec succès.',
        type: CreateRendezvousDto,
    })
    @SwaggerApiResponse({ status: 404, description: 'Rendez-vous non trouvé.' })
    async findById(@Param('id') id: string) {
        try {
            const rendezvous = await this.rendezvousService.findOne(id);
            return {
                statusCode: 200,
                message: 'Rendezvous retrieved successfully',
                data: rendezvous,
            };
        } catch (error) {
            throw new NotFoundException({
                statusCode: 404,
                message: `Rendezvous with ID ${id} not found`,
                data: null,
            });
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour un rendez-vous par ID' })
    @ApiParam({ name: 'id', description: 'ID du rendez-vous', type: String })
    @ApiBody({ type: UpdateRendezvousDto })
    @SwaggerApiResponse({
        status: 200,
        description: 'Rendez-vous mis à jour avec succès.',
        type: UpdateRendezvousDto,
    })
    @SwaggerApiResponse({ status: 404, description: 'Rendez-vous non trouvé.' })
    async update(
        @Param('id') id: string,
        @Body() updateRendezvousDto: UpdateRendezvousDto,
    ) {
        try {
            const updatedRendezvous = await this.rendezvousService.update(
                id,
                updateRendezvousDto,
            );
            return {
                statusCode: 200,
                message: 'Rendezvous updated successfully',
                data: updatedRendezvous,
            };
        } catch (error) {
            throw new NotFoundException({
                statusCode: 404,
                message: `Rendezvous with ID ${id} not found`,
                data: null,
            });
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un rendez-vous par ID' })
    @ApiParam({ name: 'id', description: 'ID du rendez-vous', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Rendez-vous supprimé avec succès.',
    })
    @SwaggerApiResponse({ status: 404, description: 'Rendez-vous non trouvé.' })
    async delete(@Param('id') id: string) {
        try {
            await this.rendezvousService.delete(id);
            return {
                statusCode: 200,
                message: 'Rendezvous deleted successfully',
                data: null,
            };
        } catch (error) {
            throw new NotFoundException({
                statusCode: 404,
                message: `Rendezvous with ID ${id} not found`,
                data: null,
            });
        }
    }
}
