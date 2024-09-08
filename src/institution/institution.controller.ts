import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { ApiResponse } from '../interface/apiResponses.interface';
import { Institution } from './institution.schema';

@Controller('institutions')
export class InstitutionController {
    constructor(private readonly institutionService: InstitutionService) {}

    // Admin
    @Post()
    async create(
        @Body() createInstitutionDto: CreateInstitutionDto,
    ): Promise<any> {
        try {
            const existingInstitution =
                await this.institutionService.findByName(
                    createInstitutionDto.name,
                );

            if (existingInstitution) {
                return {
                    status: 'error',
                    message: 'Institution with this name already exists',
                    data: null,
                };
            }

            const createdInstitution =
                await this.institutionService.create(createInstitutionDto);
            return {
                status: 'success',
                message: 'Institution created successfully',
                data: createdInstitution,
            };
        } catch (error) {
            throw new BadRequestException({
                status: 'error',
                message: 'Failed to create institution',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get()
    async findAll(): Promise<ApiResponse<Institution[]>> {
        try {
            const institutions = await this.institutionService.findAll();
            return {
                status: 'success',
                message: 'Institutions retrieved successfully',
                data: institutions,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve institutions',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get('domains')
    async getDistinctDomains(): Promise<ApiResponse<any>> {
        try {
            const domains = await this.institutionService.getDistinctDomains();
            return {
                status: 'success',
                message: 'Domains retrieved successfully',
                data: domains,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve domains',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ApiResponse<Institution>> {
        try {
            const institution = await this.institutionService.findOne(id);
            return {
                status: 'success',
                message: 'Institution retrieved successfully',
                data: institution,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Institution with ID ${id} not found`,
                data: null,
            });
        }
    }

    //Admin
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateInstitutionDto: UpdateInstitutionDto,
    ): Promise<ApiResponse<Institution>> {
        try {
            const updatedInstitution = await this.institutionService.update(
                id,
                updateInstitutionDto,
            );
            return {
                status: 'success',
                message: 'Institution updated successfully',
                data: updatedInstitution,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Institution with ID ${id} not found`,
                data: null,
            });
        }
    }

    //  Admin
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ApiResponse<Institution>> {
        try {
            await this.institutionService.remove(id);
            return {
                status: 'success',
                message: 'Institution deleted successfully',
                data: null,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `Institution with ID ${id} not found`,
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get('getbydomain/:domain')
    async findByDomain(
        @Param('domain') domain: string,
    ): Promise<ApiResponse<Institution[]>> {
        try {
            const institutions =
                await this.institutionService.findByDomain(domain);
            return {
                status: 'success',
                message: 'Institutions retrieved successfully',
                data: institutions,
            };
        } catch (error) {
            throw new NotFoundException({
                status: 'error',
                message: `No institutions found for domain ${domain}`,
                data: null,
            });
        }
    }
}
