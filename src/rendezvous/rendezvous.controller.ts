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
} from '@nestjs/common';
import { RendezvousService } from './rendezvous.service';
import { CreateRendezvousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezvousDto } from './dto/update-rendezvous.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';

@ApiTags('Rendezvous')
@Controller('rendezvous')
export class RendezvousController {
    constructor(private readonly rendezvousService: RendezvousService) {}

    @Post()
    @ApiOperation({ summary: 'Créer un nouveau rendez-vous' })
    @ApiBody({ type: CreateRendezvousDto })
    @SwaggerApiResponse({ status: 201, description: 'Rendez-vous créé avec succès.', type: CreateRendezvousDto })
    @SwaggerApiResponse({ status: 400, description: 'Échec de la création du rendez-vous.' })
    async create(@Body() createRendezvousDto: CreateRendezvousDto) {
        try {
            const rendezvous = await this.rendezvousService.create(createRendezvousDto);
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
    @SwaggerApiResponse({ status: 200, description: 'Rendez-vous récupérés avec succès.', type: [CreateRendezvousDto] })
    @SwaggerApiResponse({ status: 404, description: 'Échec de la récupération des rendez-vous.' })
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

    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un rendez-vous par ID' })
    @ApiParam({ name: 'id', description: 'ID du rendez-vous', type: String })
    @SwaggerApiResponse({ status: 200, description: 'Rendez-vous récupéré avec succès.', type: CreateRendezvousDto })
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
    @SwaggerApiResponse({ status: 200, description: 'Rendez-vous mis à jour avec succès.', type: UpdateRendezvousDto })
    @SwaggerApiResponse({ status: 404, description: 'Rendez-vous non trouvé.' })
    async update(
        @Param('id') id: string,
        @Body() updateRendezvousDto: UpdateRendezvousDto,
    ) {
        try {
            const updatedRendezvous = await this.rendezvousService.update(id, updateRendezvousDto);
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
    @SwaggerApiResponse({ status: 200, description: 'Rendez-vous supprimé avec succès.' })
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

    @Get('institution/:institutionId')
    @ApiOperation({ summary: 'Obtenir les rendez-vous par institution' })
    @ApiParam({ name: 'institutionId', description: 'ID de l\'institution', type: String })
    @SwaggerApiResponse({ status: 200, description: 'Rendez-vous récupérés pour l\'institution avec succès.', type: [CreateRendezvousDto] })
    @SwaggerApiResponse({ status: 404, description: 'Aucun rendez-vous trouvé pour cette institution.' })
    async findByInstitution(@Param('institutionId') institutionId: string) {
        try {
            const rendezvous = await this.rendezvousService.findByInstitution(institutionId);
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
    @SwaggerApiResponse({ status: 200, description: 'Rendez-vous récupérés pour le citoyen avec succès.', type: [CreateRendezvousDto] })
    @SwaggerApiResponse({ status: 404, description: 'Aucun rendez-vous trouvé pour ce citoyen.' })
    async findByCitoyen(@Param('citoyenId') citoyenId: string) {
        try {
            const rendezvous = await this.rendezvousService.findByCitoyen(citoyenId);
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
}
