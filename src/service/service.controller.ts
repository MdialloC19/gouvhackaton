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
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiResponse } from '../interface/apiResponses.interface';
import { Service } from './service.schema';

@Controller('services')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) {}

    //Admin
    @Post()
    async create(
        @Body() createServiceDto: CreateServiceDto,
    ): Promise<ApiResponse<Service>> {
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

            return {
                status: 'success',
                message: 'Service created successfully',
                data: createdService,
            };
        } catch (error) {
            throw new BadRequestException({
                status: 'error',
                message: 'Failed to create service',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get()
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

    // Citoyen, Fonctionnaire , Admin
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ApiResponse<Service>> {
        try {
            const service = await this.serviceService.findOne(id);
            return {
                status: 'success',
                message: 'Service retrieved successfully',
                data: service,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Service with ID ${id} not found`,
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get('byInstitution/:institutionId')
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

    // Admin
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateServiceDto: UpdateServiceDto,
    ): Promise<ApiResponse<Service>> {
        try {
            const updatedService = await this.serviceService.update(
                id,
                updateServiceDto,
            );
            return {
                status: 'success',
                message: 'Service updated successfully',
                data: updatedService,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Service with ID ${id} not found`,
                data: null,
            });
        }
    }

    //Admin

    @Delete(':id')
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

    // Admin
    @Put(':id/add-institution')
    async addInstitution(
        @Param('id') serviceId: string,
        @Body('institutionId') institutionId: string,
    ): Promise<ApiResponse<Service>> {
        try {
            const updatedService =
                await this.serviceService.addInstitutionToService(
                    serviceId,
                    institutionId,
                );
            return {
                status: 'success',
                message: 'Institution added to service successfully',
                data: updatedService,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Failed to add institution to service with ID ${serviceId}`,
                data: null,
            });
        }
    }

    // Admin
    @Put(':serviceId/remove-institution/:institutionId')
    async removeInstitutionFromService(
        @Param('serviceId') serviceId: string,
        @Param('institutionId') institutionId: string,
    ): Promise<ApiResponse<Service>> {
        try {
            const updatedService =
                await this.serviceService.removeInstitutionFromService(
                    serviceId,
                    institutionId,
                );
            return {
                status: 'success',
                message: 'Institution removed from service successfully',
                data: updatedService,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Failed to remove institution from service with ID ${serviceId}`,
                data: null,
            });
        }
    }
}
