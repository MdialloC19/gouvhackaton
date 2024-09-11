import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
    Query,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request-citoyen.dto';
import { Request } from './request.schema';
import { UpdateRequestDto } from './dto/update-request-fonctionnaire.dto';
import {
    ApiResponse as SwaggerApiResponse,
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { ApiResponse } from 'src/interface/apiResponses.interface';

@ApiTags('Requests')
@Controller('requests')
export class RequestController {
    constructor(private readonly requestService: RequestService) {}

    @Post()
    @ApiOperation({ summary: 'Créer une nouvelle demande' })
    @ApiBody({ type: CreateRequestDto })
    @SwaggerApiResponse({
        status: 201,
        description: 'Demande créée avec succès.',
        type: Request,
    })
    @SwaggerApiResponse({
        status: 400,
        description: 'Échec de la création de la demande.',
    })
    async createRequest(
        @Body() createRequestDto: CreateRequestDto,
    ): Promise<ApiResponse<Request | null>> {
        try {
            const request =
                await this.requestService.createRequest(createRequestDto);
            return {
                status: 'success',
                message: 'Request created successfully',
                data: request,
            };
        } catch (error) {
            throw new BadRequestException({
                status: 'error',
                message: error.message,
                data: null,
            });
        }
    }

    @Get()
    @ApiOperation({ summary: 'Obtenir toutes les demandes' })
    @SwaggerApiResponse({
        status: 200,
        description: 'Demandes récupérées avec succès.',
        type: [Request],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des demandes.',
    })
    async findAll(): Promise<ApiResponse<Request[] | null>> {
        const requests = await this.requestService.findAll();
        return {
            status: 'success',
            message: 'Requests retrieved successfully',
            data: requests,
        };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour une demande par ID' })
    @ApiParam({ name: 'id', description: 'ID de la demande', type: String })
    @ApiBody({ type: UpdateRequestDto })
    @SwaggerApiResponse({
        status: 200,
        description: 'Demande mise à jour avec succès.',
        type: Request,
    })
    @SwaggerApiResponse({ status: 404, description: 'Demande non trouvée.' })
    @SwaggerApiResponse({
        status: 400,
        description: 'Échec de la mise à jour de la demande.',
    })
    async update(
        @Param('id') id: string,
        @Body() updateRequestDto: UpdateRequestDto,
    ): Promise<ApiResponse<Request | null>> {
        try {
            const updatedRequest = await this.requestService.update(
                id,
                updateRequestDto,
            );
            return {
                status: 'success',
                message: 'Request updated successfully',
                data: updatedRequest,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            if (error instanceof BadRequestException) {
                throw new BadRequestException({
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

    @Get('citoyen/:citoyenId')
    @ApiOperation({ summary: 'Obtenir les demandes pour un citoyen' })
    @ApiParam({ name: 'citoyenId', description: 'ID du citoyen', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Demandes pour le citoyen récupérées avec succès.',
        type: [Request],
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Aucune demande trouvée pour ce citoyen.',
    })
    @SwaggerApiResponse({
        status: 400,
        description: 'Échec de la récupération des demandes pour le citoyen.',
    })
    async findByCitoyen(
        @Param('citoyenId') citoyenId: string,
    ): Promise<ApiResponse<Request[] | null>> {
        try {
            const requests = await this.requestService.findByCitoyen(citoyenId);
            return {
                status: 'success',
                message: 'Requests for citoyen retrieved successfully',
                data: requests,
            };
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
    @Get('service/:serviceId/fonctionnaire/:fonctionnaireId')
    @ApiOperation({
        summary:
            'Obtenir les demandes pour un service et un fonctionnaire avec des options de pagination et de filtrage',
    })
    @ApiParam({ name: 'serviceId', description: 'ID du service', type: String })
    @ApiParam({
        name: 'fonctionnaireId',
        description: 'ID du fonctionnaire',
        type: String,
    })
    @ApiQuery({
        name: 'status',
        description: 'Filtrer par statut de la demande',
        required: false,
    })
    @ApiQuery({
        name: 'range',
        description: 'Plage de résultats à récupérer',
        required: false,
    })
    @ApiQuery({
        name: 'sort',
        description: 'Critère de tri des résultats',
        required: false,
    })
    @ApiQuery({
        name: 'filter',
        description: 'Critères de filtrage supplémentaires',
        required: false,
    })
    async findByServiceAndStatus(
        @Param('serviceId') serviceId: string,
        @Param('fonctionnaireId') fonctionnaireId: string,
        @Query('status') status?: string,
        @Query('range') range?: string,
        @Query('sort') sort?: string,
        @Query('filter') filter?: string,
    ): Promise<ApiResponse<Request[] | null>> {
        try {
            const requests = await this.requestService.findByServiceAndStatus(
                serviceId,
                fonctionnaireId,
                status,
                range,
                sort,
                filter,
            );
            return {
                status: 'success',
                message:
                    'Requests for service and fonctionnaire retrieved successfully',
                data: requests,
            };
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
    @ApiOperation({ summary: 'Obtenir les demandes pour une institution' })
    @ApiParam({
        name: 'institutionId',
        description: "ID de l'institution",
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description: "Demandes pour l'institution récupérées avec succès.",
        type: [Request],
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Aucune demande trouvée pour cette institution.',
    })
    @SwaggerApiResponse({
        status: 400,
        description:
            "Échec de la récupération des demandes pour l'institution.",
    })
    async findByInstitution(
        @Param('institutionId') institutionId: string,
    ): Promise<ApiResponse<Request[] | null>> {
        try {
            const requests =
                await this.requestService.findByInstitution(institutionId);
            return {
                status: 'success',
                message: 'Requests for institution retrieved successfully',
                data: requests,
            };
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

    @Get('processedby/:fonctionnaireId')
    @ApiOperation({
        summary: 'Obtenir les demandes traitées par un fonctionnaire',
    })
    @ApiParam({
        name: 'fonctionnaireId',
        description: 'ID du fonctionnaire',
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description:
            'Demandes traitées par le fonctionnaire récupérées avec succès.',
        type: [Request],
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Aucune demande trouvée pour ce fonctionnaire.',
    })
    @SwaggerApiResponse({
        status: 400,
        description:
            'Échec de la récupération des demandes traitées par le fonctionnaire.',
    })
    async findByProcessedBy(
        @Param('fonctionnaireId') fonctionnaireId: string,
    ): Promise<ApiResponse<Request[] | null>> {
        try {
            const requests =
                await this.requestService.findByProcessedBy(fonctionnaireId);
            return {
                status: 'success',
                message:
                    'Requests processed by fonctionnaire retrieved successfully',
                data: requests,
            };
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

    @Get('list')
    @ApiOperation({
        summary: 'Obtenir une liste de requests avec pagination et tri',
    })
    @ApiQuery({
        name: 'range',
        required: false,
        description: 'Plage des requests à retourner',
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        description: 'Critère de tri des requests',
    })
    @ApiQuery({
        name: 'filter',
        required: false,
        description: 'Filtres à appliquer',
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Liste des requests récupérée avec succès.',
        type: [Request],
    })
    async getList(
        @Query('range') range?: string,
        @Query('sort') sort?: string,
        @Query('filter') filter?: string,
    ): Promise<{ data: Request[]; total: number }> {
        const requests = await this.requestService.getList(range, sort, filter);
        const total = await this.requestService.countFiltered(filter);
        return { data: requests, total };
    }

    @Get('many')
    @ApiOperation({ summary: 'Obtenir plusieurs requests par leurs ID' })
    @ApiQuery({
        name: 'filter',
        description: 'Filtre basé sur les IDs',
        required: true,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'requests récupérés avec succès.',
        type: [Request],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des requests.',
    })
    async getMany(
        @Query('filter') filter: string,
    ): Promise<ApiResponse<Request[]>> {
        try {
            const requests = await this.requestService.getMany(filter);
            return {
                status: 'success',
                message: 'requests récupérés avec succès',
                data: requests,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des requests',
                data: null,
            });
        }
    }

    @Get('manyReference')
    @ApiOperation({ summary: 'Obtenir des requests par référence' })
    @ApiQuery({
        name: 'filter',
        description: 'Filtre basé sur la référence (e.g. author_id)',
        required: true,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'requests récupérés avec succès.',
        type: [Request],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des requests.',
    })
    async getManyReference(
        @Query('filter') filter: string,
    ): Promise<ApiResponse<Request[]>> {
        try {
            const requests = await this.requestService.getManyReference(filter);
            return {
                status: 'success',
                message: 'requests récupérés avec succès',
                data: requests,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des requests',
                data: null,
            });
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir une demande par ID' })
    @ApiParam({ name: 'id', description: 'ID de la demande', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Demande récupérée avec succès.',
        type: Request,
    })
    @SwaggerApiResponse({ status: 404, description: 'Demande non trouvée.' })
    @SwaggerApiResponse({
        status: 400,
        description: 'Échec de la récupération de la demande.',
    })
    async findById(
        @Param('id') id: string,
    ): Promise<ApiResponse<Request | null>> {
        try {
            const request = await this.requestService.findById(id);
            return {
                status: 'success',
                message: 'Request retrieved successfully',
                data: request,
            };
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
}
