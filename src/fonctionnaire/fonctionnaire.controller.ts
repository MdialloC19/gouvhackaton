import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { FonctionnaireService } from './fonctionnaire.service';
import { CreateFonctionnaireDto } from './dto/create-fonctionnaire.dto';
import { UpdateFonctionnaireDto } from './dto/update-fonctionnaire.dto';
import { Fonctionnaire } from './fonctionnaire.schema';
import { ApiResponse } from '../interface/apiResponses.interface';

@Controller('fonctionnaires')
export class FonctionnaireController {
    constructor(private readonly fonctionnaireService: FonctionnaireService) {}

    //Admin
    @Post()
    async create(
        @Body() createFonctionnaireDto: CreateFonctionnaireDto,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const fonctionnaire = await this.fonctionnaireService.create(
                createFonctionnaireDto,
            );
            return {
                status: 'success',
                message: 'Fonctionnaire created successfully',
                data: fonctionnaire,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to create fonctionnaire',
                data: null,
            });
        }
    }

    //Fonctionnaire , Admin
    @Get()
    async findAll(): Promise<ApiResponse<Fonctionnaire[] | null>> {
        try {
            const fonctionnaires = await this.fonctionnaireService.findAll();
            return {
                status: 'success',
                message: 'Fonctionnaires retrieved successfully',
                data: fonctionnaires,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve fonctionnaires',
                data: null,
            });
        }
    }

    //Fonctionnaire , Admin
    @Get(':id')
    async findOne(
        @Param('id') id: string,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const fonctionnaire = await this.fonctionnaireService.findOne(id);
            return {
                status: 'success',
                message: 'Fonctionnaire retrieved successfully',
                data: fonctionnaire,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve fonctionnaire',
                data: null,
            });
        }
    }

    //Fonctionnaire , Admin
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateFonctionnaireDto: UpdateFonctionnaireDto,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const updatedFonctionnaire = await this.fonctionnaireService.update(
                id,
                updateFonctionnaireDto,
            );
            return {
                status: 'success',
                message: 'Fonctionnaire updated successfully',
                data: updatedFonctionnaire,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to update fonctionnaire',
                data: null,
            });
        }
    }

    //Admin
    @Delete(':id')
    async remove(
        @Param('id') id: string,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const deletedFonctionnaire =
                await this.fonctionnaireService.remove(id);
            return {
                status: 'success',
                message: 'Fonctionnaire deleted successfully',
                data: deletedFonctionnaire,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to delete fonctionnaire',
                data: null,
            });
        }
    }

    //Fonctionnaire
    @Get('email')
    async findByEmail(
        @Query('email') email: string,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const fonctionnaire =
                await this.fonctionnaireService.findByEmail(email);
            return {
                status: 'success',
                message: 'Fonctionnaire retrieved successfully',
                data: fonctionnaire,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve fonctionnaire by email',
                data: null,
            });
        }
    }

    //Fonctionnaire , Admin
    @Get('idnumber')
    async findByIdNumber(
        @Query('idNumber') idNumber: string,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const fonctionnaire =
                await this.fonctionnaireService.findByIdNumber(idNumber);
            return {
                status: 'success',
                message: 'Fonctionnaire retrieved successfully',
                data: fonctionnaire,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve fonctionnaire by ID number',
                data: null,
            });
        }
    }
    //Fonctionnaire , Admin
    @Get('institution')
    async findByInstitution(
        @Query('institutionId') institutionId: string,
    ): Promise<ApiResponse<Fonctionnaire[] | null>> {
        try {
            const fonctionnaires =
                await this.fonctionnaireService.findByInstitution(
                    institutionId,
                );
            return {
                status: 'success',
                message: 'Fonctionnaires retrieved successfully',
                data: fonctionnaires,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve fonctionnaires by institution',
                data: null,
            });
        }
    }

    //Fonctionnaire , Admin
    @Get('cni')
    async findByCNI(
        @Query('CNI') CNI: string,
    ): Promise<ApiResponse<Fonctionnaire | null>> {
        try {
            const fonctionnaire =
                await this.fonctionnaireService.findByCNI(CNI);
            return {
                status: 'success',
                message: 'Fonctionnaire retrieved successfully',
                data: fonctionnaire,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve fonctionnaire by CNI',
                data: null,
            });
        }
    }
}
