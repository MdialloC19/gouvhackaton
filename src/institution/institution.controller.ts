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

@Controller('institutions')
export class InstitutionController {
    constructor(private readonly institutionService: InstitutionService) {}

    @Post()
    async create(
        @Body() createInstitutionDto: CreateInstitutionDto,
    ): Promise<any> {
        try {
            const createdInstitution =
                await this.institutionService.create(createInstitutionDto);
            return {
                statusCode: 201,
                message: 'Institution created successfully',
                data: createdInstitution,
            };
        } catch (error) {
            throw new BadRequestException({
                statusCode: 400,
                message: 'Failed to create institution',
                error: error.message,
            });
        }
    }

    @Get()
    async findAll(): Promise<any> {
        try {
            const institutions = await this.institutionService.findAll();
            return {
                statusCode: 200,
                message: 'Institutions retrieved successfully',
                data: institutions,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                statusCode: 500,
                message: 'Failed to retrieve institutions',
                error: error.message,
            });
        }
    }
     
    // Don't have schema so for domains so any is 
    @Get('domains')
    async getDistinctDomains(): Promise<any> {
        try {
            const domains = await this.institutionService.getDistinctDomains();
            return {
                statusCode: 200,
                message: 'Domains retrieved successfully',
                data: domains,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                statusCode: 500,
                message: 'Failed to retrieve domains',
                error: error.message,
            });
        }
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
            throw new NotFoundException({
                statusCode: 404,
                message: `Institution with ID ${id} not found`,
                error: error.message,
            });
        }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateInstitutionDto: UpdateInstitutionDto,
    ): Promise<any> {
        try {
            const updatedInstitution = await this.institutionService.update(
                id,
                updateInstitutionDto,
            );
            return {
                statusCode: 200,
                message: 'Institution updated successfully',
                data: updatedInstitution,
            };
        } catch (error) {
            throw new NotFoundException({
                statusCode: 404,
                message: `Institution with ID ${id} not found`,
                error: error.message,
            });
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
            throw new NotFoundException({
                statusCode: 404,
                message: `Institution with ID ${id} not found`,
                error: error.message,
            });
        }
    }

    @Get('searchbydomain/:domain')
    async findByDomain(@Param('domain') domain: string): Promise<any> {
        try {
            const institutions = await this.institutionService.findByDomain(domain);
            return {
                statusCode: 200,
                message: 'Institutions retrieved successfully',
                data: institutions,
            };
        } catch (error) {
            throw new NotFoundException({
                statusCode: 404,
                message: `No institutions found for domain ${domain}`,
                error: error.message,
            });
        }
    }
}
