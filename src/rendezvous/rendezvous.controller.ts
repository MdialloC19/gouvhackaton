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

@Controller('rendezvous')
export class RendezvousController {
    constructor(private readonly rendezvousService: RendezvousService) {}

    @Post()
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
