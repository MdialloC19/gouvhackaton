import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
    Query,
    ConflictException,
    Res,
    Logger,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
    ApiResponse as SwaggerApiResponse,
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { ApiResponse } from '../interface/apiResponses.interface';
import { Service } from './service.schema';
import { Response } from 'express';

@ApiTags('Services')
@Controller('services')
export class ServiceController {
    private readonly logger = new Logger(ServiceController.name);
    constructor(private readonly serviceService: ServiceService) {}

    @Post()
    @ApiOperation({ summary: 'Créer un nouveau service' })
    @ApiBody({ type: CreateServiceDto })
    @SwaggerApiResponse({
        status: 201,
        description: 'Service créé avec succès.',
        type: Service,
    })
    @SwaggerApiResponse({
        status: 400,
        description: 'Échec de la création du service.',
    })
    async create(@Body() createServiceDto: CreateServiceDto) {
        try {
            const existingService = await this.serviceService.findByName(
                createServiceDto.name,
            );

            if (existingService) {
                return {
                    status: 'error',
                    message: 'Service with this name already exists',
                    data: null,
                };
            }
            const createdService =
                await this.serviceService.create(createServiceDto);

            const { _id, ...serviceWithoutId } = createdService;
            const result = { id: _id.toString(), ...serviceWithoutId };
            return result;
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            this.logger.error(error);
            throw new BadRequestException({
                status: 'error',
                message: 'Failed to create service',
                data: null,
            });
        }
    }

    @Get()
    @ApiOperation({ summary: 'Obtenir tous les services' })
    @SwaggerApiResponse({
        status: 200,
        description: 'Services récupérés avec succès.',
        type: [Service],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des services.',
    })
    async findAll(): Promise<ApiResponse<Service[]>> {
        try {
            const services = await this.serviceService.findAll();
            return {
                status: 'success',
                message: 'Services retrieved successfully',
                data: services,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve services',
                data: null,
            });
        }
    }
    @Get('list')
    @ApiOperation({
        summary: 'Obtenir une liste de services avec pagination et tri',
    })
    @ApiQuery({
        name: 'range',
        required: false,
        description: 'Plage des services à retourner',
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        description: 'Critère de tri des services',
    })
    @ApiQuery({
        name: 'filter',
        required: false,
        description: 'Filtres à appliquer',
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'Liste des services récupérée avec succès.',
        type: [Service],
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
            const services = await this.serviceService.getList(
                range,
                sort,
                filter,
            );
            const total = await this.serviceService.countFiltered(filter);
            const formattedServices = services.map((service) => ({
                ...service.toObject(),
                id: service._id.toString(),
            }));
            const servicesWithoutId = formattedServices.map((service) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _id, ...rest } = service;
                return rest;
            });
            if (args.order) {
                const length = services.length;
                response.set(
                    'Content-Range',
                    `services ${args.skip}-${args.skip + length}/${total}`,
                );
            }
            response.json(servicesWithoutId);
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des services',
                data: null,
            });
        }
    }

    @Get('many')
    @ApiOperation({ summary: 'Obtenir plusieurs services par leurs ID' })
    @ApiQuery({
        name: 'filter',
        description: 'Filtre basé sur les IDs',
        required: true,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'services récupérés avec succès.',
        type: [Service],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des services.',
    })
    async getMany(
        @Query('filter') filter: string,
    ): Promise<ApiResponse<Service[]>> {
        try {
            const services = await this.serviceService.getMany(filter);
            return {
                status: 'success',
                message: 'services récupérés avec succès',
                data: services,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des services',
                data: null,
            });
        }
    }

    @Get('manyReference')
    @ApiOperation({ summary: 'Obtenir des services par référence' })
    @ApiQuery({
        name: 'filter',
        description: 'Filtre basé sur la référence (e.g. author_id)',
        required: true,
    })
    @SwaggerApiResponse({
        status: 200,
        description: 'services récupérés avec succès.',
        type: [Service],
    })
    @SwaggerApiResponse({
        status: 500,
        description: 'Échec de la récupération des services.',
    })
    async getManyReference(
        @Query('filter') filter: string,
    ): Promise<ApiResponse<Service[]>> {
        try {
            const services = await this.serviceService.getManyReference(filter);
            return {
                status: 'success',
                message: 'services récupérés avec succès',
                data: services,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des services',
                data: null,
            });
        }
    }
    @ApiOperation({ summary: 'Obtenir les catégories distinctes des services' })
    @Get('categories/distinct')
    async getDistinctCategories() {
        return await this.serviceService.getDistinctCategories();
    }

    @ApiOperation({ summary: 'Obtenir les services par catégorie' })
    @Get('category/:category')
    async getByCategory(@Param('category') category: string) {
        return await this.serviceService.getByCategory(category);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un service par ID' })
    @ApiParam({ name: 'id', description: 'ID du service', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Service récupéré avec succès.',
        type: Service,
    })
    @SwaggerApiResponse({ status: 404, description: 'Service non trouvé.' })
    async findOne(@Param('id') id: string) {
        try {
            const service = await this.serviceService.findOne(id);
            if (!service) {
                throw new NotFoundException(`Service with ID ${id} not found`);
            }
            const formattedService = service.toObject();
            const { _id, ...serviceWithoutId } = formattedService;
            const result = { id: _id.toString(), ...serviceWithoutId };
            return result;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(error);
            throw new InternalServerErrorException({
                status: 'error',
                message: `Échec de la récupération du service ${id}`,
                data: null,
            });
        }
    }

    @Get('byInstitution/:institutionId')
    @ApiOperation({ summary: 'Obtenir les services par institution' })
    @ApiParam({
        name: 'institutionId',
        description: "ID de l'institution",
        type: String,
    })
    @SwaggerApiResponse({
        status: 200,
        description: "Services récupérés pour l'institution avec succès.",
        type: [Service],
    })
    @SwaggerApiResponse({
        status: 404,
        description: 'Aucun service trouvé pour cette institution.',
    })
    @SwaggerApiResponse({
        status: 500,
        description:
            "Échec de la récupération des services pour l'institution.",
    })
    async findByInstitution(
        @Param('institutionId') institutionId: string,
    ): Promise<ApiResponse<Service[]>> {
        try {
            const services =
                await this.serviceService.findByInstitution(institutionId);
            if (services.length === 0) {
                throw new NotFoundException({
                    status: 'error',
                    message: `No services found for the institution with ID ${institutionId}`,
                    data: null,
                });
            }
            return {
                status: 'success',
                message: 'Services retrieved successfully',
                data: services,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve services by institution',
                data: null,
            });
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Mettre à jour un service par ID' })
    @ApiParam({ name: 'id', description: 'ID du service', type: String })
    @ApiBody({ type: UpdateServiceDto })
    @SwaggerApiResponse({
        status: 200,
        description: 'Service mis à jour avec succès.',
        type: Service,
    })
    @SwaggerApiResponse({ status: 404, description: 'Service non trouvé.' })
    async update(
        @Param('id') id: string,
        @Body() updateServiceDto: UpdateServiceDto,
    ) {
        try {
            const updatedService = await this.serviceService.update(
                id,
                updateServiceDto,
            );
            const { _id, ...serviceWithoutId } = updatedService;
            const result = { id: _id.toString(), ...serviceWithoutId };
            return result;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(error);
            throw new InternalServerErrorException({
                status: 'error',
                message: `Échec de la mise à jour du service ${id}`,
                data: null,
            });
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un service par ID' })
    @ApiParam({ name: 'id', description: 'ID du service', type: String })
    @SwaggerApiResponse({
        status: 200,
        description: 'Service supprimé avec succès.',
    })
    @SwaggerApiResponse({ status: 404, description: 'Service non trouvé.' })
    async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
        try {
            await this.serviceService.remove(id);
            return {
                status: 'success',
                message: 'Service deleted successfully',
                data: null,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Service with ID ${id} not found`,
                data: null,
            });
        }
    }
}
