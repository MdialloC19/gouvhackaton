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
import { CitoyenService } from './citoyen.service';
import { CreateCitoyenDto } from './dto/create-citoyen.dto';
import { UpdateCitoyenDto } from './dto/update-citoyen.dto';
import { Citoyen } from './citoyen.schema';
import { ApiResponse } from '../interface/apiResponses.interface';

@Controller('citoyens')
export class CitoyenController {
    constructor(private readonly citoyenService: CitoyenService) {}

    @Post()
    async create(@Body() createCitoyenDto: CreateCitoyenDto): Promise<ApiResponse<Citoyen>> {
        try {
            const citoyen = await this.citoyenService.create(createCitoyenDto);
            return {
                status: 'success',
                message: 'Citoyen created successfully',
                data: citoyen,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to create citoyen',
                data: null,
            });
        }
    }

    @Get()
    async findAll(): Promise<ApiResponse<Citoyen[]>> {
        try {
            const citoyens = await this.citoyenService.findAll();
            return {
                status: 'success',
                message: 'Citoyens retrieved successfully',
                data: citoyens,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve citoyens',
                data: null,
            });
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ApiResponse<Citoyen>> {
        try {
            const citoyen = await this.citoyenService.findOne(id);
            return {
                status: 'success',
                message: 'Citoyen retrieved successfully',
                data: citoyen,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve citoyen',
                data: null,
            });
        }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCitoyenDto: UpdateCitoyenDto,
    ): Promise<ApiResponse<Citoyen>> {
        try {
            const updatedCitoyen = await this.citoyenService.update(id, updateCitoyenDto);
            return {
                status: 'success',
                message: 'Citoyen updated successfully',
                data: updatedCitoyen,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to update citoyen',
                data: null,
            });
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ApiResponse<void>> {
        try {
            await this.citoyenService.remove(id);
            return {
                status: 'success',
                message: 'Citoyen deleted successfully',
                data: null,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to delete citoyen',
                data: null,
            });
        }
    }

    @Get('phone')
    async findByPhoneNumber(@Query('phoneNumber') phoneNumber: string): Promise<ApiResponse<Citoyen | null>> {
        try {
            const citoyen = await this.citoyenService.findByPhoneNumber(phoneNumber);
            return {
                status: 'success',
                message: 'Citoyen retrieved successfully',
                data: citoyen,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve citoyen by phone number',
                data: null,
            });
        }
    }

    @Get('cni')
    async findByCNI(@Query('CNI') CNI: string): Promise<ApiResponse<Citoyen | null>> {
        try {
            const citoyen = await this.citoyenService.findByCNI(CNI);
            return {
                status: 'success',
                message: 'Citoyen retrieved successfully',
                data: citoyen,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve citoyen by CNI',
                data: null,
            });
        }
    }
}
