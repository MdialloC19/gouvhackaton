import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { Institution } from './institution.schema';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Controller('institutions')
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @Post()
  async create(@Body() createInstitutionDto: CreateInstitutionDto): Promise<any> {
    try {
      const createdInstitution = await this.institutionService.create(createInstitutionDto);
      return {
        statusCode: 201,
        message: 'Institution created successfully',
        data: createdInstitution,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll(): Promise<any> {
    const institutions = await this.institutionService.findAll();
    return {
      statusCode: 200,
      message: 'Institutions retrieved successfully',
      data: institutions,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      const institution = await this.institutionService.findOne(id);
      return {
        statusCode: 200,
        message: 'Institution retrieved successfully',
        data: institution,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateInstitutionDto: UpdateInstitutionDto): Promise<any> {
    try {
      const updatedInstitution = await this.institutionService.update(id, updateInstitutionDto);
      return {
        statusCode: 200,
        message: 'Institution updated successfully',
        data: updatedInstitution,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    try {
      await this.institutionService.remove(id);
      return {
        statusCode: 200,
        message: 'Institution deleted successfully',
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
