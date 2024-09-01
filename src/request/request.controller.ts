import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { Request } from './request.schema';

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
}
