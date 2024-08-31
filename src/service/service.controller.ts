import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './service.schema';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  async findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

 @Get('byInstitution/:institutionId')
  async findByInstitution(@Param('institutionId') institutionId: string) {
    const services = await this.serviceService.findByInstitution(institutionId);
    if (services.length === 0) {
      throw new NotFoundException(`No services found for the institution with ID ${institutionId}`);
    }
    return {
      statusCode: 200,
      message: 'Services retrieved successfully',
      data: services,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Put(':id/add-institution')
  async addInstitution(
    @Param('id') serviceId: string,
    @Body('institutionId') institutionId: string
  ): Promise<Service> {
    return this.serviceService.addInstitutionToService(serviceId, institutionId);
  }

  @Put(':serviceId/remove-institution/:institutionId')
  removeInstitutionFromService(
    @Param('serviceId') serviceId: string,
    @Param('institutionId') institutionId: string,
  ) {
    return this.serviceService.removeInstitutionFromService(serviceId, institutionId);
  }
}
