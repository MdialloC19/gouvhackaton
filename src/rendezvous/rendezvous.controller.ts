import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RendezvousService } from './rendezvous.service';
import { CreateRendezvousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezvousDto } from './dto/update-rendezvous.dto';

@Controller('rendezvous')
export class RendezvousController {
  constructor(private readonly rendezvousService: RendezvousService) {}

  @Post()
  async create(@Body() createRendezvousDto: CreateRendezvousDto) {
    return await this.rendezvousService.create(createRendezvousDto);
  }

  @Get()
  async findAll() {
    return await this.rendezvousService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rendezvousService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRendezvousDto: UpdateRendezvousDto) {
    return await this.rendezvousService.update(id, updateRendezvousDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.rendezvousService.delete(id);
  }
}
