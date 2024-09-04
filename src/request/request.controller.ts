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

@Controller('requests')
export class RequestController {
    constructor(private readonly requestService: RequestService) {}

    @Post()
    async createRequest(
        @Body() createRequestDto: CreateRequestDto,
    ): Promise<Request> {
        return this.requestService.createRequest(createRequestDto);
    }
    @Get()
    async findAll(): Promise<Request[]> {
        return this.requestService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Request> {
        return this.requestService.findById(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateRequestDto: UpdateRequestDto,
    ) {
        try {
            // Appel du service pour mettre à jour la demande
            const updatedRequest = await this.requestService.update(
                id,
                updateRequestDto,
            );

            return {
                statusCode: 200,
                message: 'Request updated successfully',
                data: updatedRequest,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message);
            }
            throw new Error('An unexpected error occurred');
        }
    }
}
