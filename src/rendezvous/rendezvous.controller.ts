import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
} from '@nestjs/common';
import { RendezvousService } from './rendezvous.service';
import { CreateRendezvousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezvousDto } from './dto/update-rendezvous.dto';

@Controller('rendezvous')
export class RendezvousController {
    constructor(private readonly rendezvousService: RendezvousService) {}

    @Post()
    async create(@Body() createRendezvousDto: CreateRendezvousDto) {
        const rendezvous =
            await this.rendezvousService.create(createRendezvousDto);
        return {
            statusCode: 201,
            message: 'Rendezvous created successfully',
            data: rendezvous,
        };
    }

    @Get()
    async findAll() {
        const rendezvousList = await this.rendezvousService.findAll();
        return {
            statusCode: 200,
            message: 'Rendezvous retrieved successfully',
            data: rendezvousList,
        };
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const rendezvous = await this.rendezvousService.findOne(id);
        return {
            statusCode: 200,
            message: 'Rendezvous retrieved successfully',
            data: rendezvous,
        };
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateRendezvousDto: UpdateRendezvousDto,
    ) {
        const updatedRendezvous = await this.rendezvousService.update(
            id,
            updateRendezvousDto,
        );
        return {
            statusCode: 200,
            message: 'Rendezvous updated successfully',
            data: updatedRendezvous,
        };
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.rendezvousService.delete(id);
        return {
            statusCode: 200,
            message: 'Rendezvous deleted successfully',
        };
    }
}
