import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request-citoyen.dto';
import { Request } from './request.schema';
import { UpdateRequestDto } from './dto/update-request-fonctionnaire.dto';
import { ApiResponse } from '../interface/apiResponses.interface';


@Controller('requests')
export class RequestController {
    constructor(private readonly requestService: RequestService) {}

    @Post()
    async createRequest(
        @Body() createRequestDto: CreateRequestDto,
    ): Promise<ApiResponse<Request|null>> {
        try {
            const request = await this.requestService.createRequest(createRequestDto);
            return {
                status: 'success',
                message: 'Request created successfully',
                data: request,
            };
        } catch (error) {
            throw new BadRequestException({
                status: 'error',
                message: error.message,
                data: null,
            });
        }
    }

    @Get()
    async findAll(): Promise<ApiResponse<Request[]|null>> {
        const requests = await this.requestService.findAll();
        return {
            status: 'success',
            message: 'Requests retrieved successfully',
            data: requests,
        };
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<ApiResponse<Request|null>> {
        try {
            const request = await this.requestService.findById(id);
            return {
                status: 'success',
                message: 'Request retrieved successfully',
                data: request,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            throw new BadRequestException({
                status: 'error',
                message: 'An unexpected error occurred',
                data: null,
            });
        }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateRequestDto: UpdateRequestDto,
    ): Promise<ApiResponse<Request|null>> {
        try {
            const updatedRequest = await this.requestService.update(id, updateRequestDto);
            return {
                status: 'success',
                message: 'Request updated successfully',
                data: updatedRequest,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            if (error instanceof BadRequestException) {
                throw new BadRequestException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            throw new BadRequestException({
                status: 'error',
                message: 'An unexpected error occurred',
                data: null,
            });
        }
    }

    @Get('citoyen/:citoyenId')
    async findByCitoyen(@Param('citoyenId') citoyenId: string): Promise<ApiResponse<Request[]|null>> {
        try {
            const requests = await this.requestService.findByCitoyen(citoyenId);
            return {
                status: 'success',
                message: 'Requests for citoyen retrieved successfully',
                data: requests,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            throw new BadRequestException({
                status: 'error',
                message: 'An unexpected error occurred',
                data: null,
            });
        }
    }

    @Get('service/:serviceId')
    async findByService(@Param('serviceId') serviceId: string): Promise<ApiResponse<Request[]|null>> {
        try {
            const requests = await this.requestService.findByService(serviceId);
            return {
                status: 'success',
                message: 'Requests for service retrieved successfully',
                data: requests,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            throw new BadRequestException({
                status: 'error',
                message: 'An unexpected error occurred',
                data: null,
            });
        }
    }

    @Get('institution/:institutionId')
    async findByInstitution(@Param('institutionId') institutionId: string): Promise<ApiResponse<Request[]|null>> {
        try {
            const requests = await this.requestService.findByInstitution(institutionId);
            return {
                status: 'success',
                message: 'Requests for institution retrieved successfully',
                data: requests,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            throw new BadRequestException({
                status: 'error',
                message: 'An unexpected error occurred',
                data: null,
            });
        }
    }

    @Get('processedby/:fonctionnaireId')
    async findByProcessedBy(@Param('fonctionnaireId') fonctionnaireId: string): Promise<ApiResponse<Request[]|null>> {
        try {
            const requests = await this.requestService.findByProcessedBy(fonctionnaireId);
            return {
                status: 'success',
                message: 'Requests processed by fonctionnaire retrieved successfully',
                data: requests,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({
                    status: 'error',
                    message: error.message,
                    data: null,
                });
            }
            throw new BadRequestException({
                status: 'error',
                message: 'An unexpected error occurred',
                data: null,
            });
        }
    }
}
