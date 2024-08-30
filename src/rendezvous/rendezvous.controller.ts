import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RendezvousService } from './rendezvous.service';
import { CreateRendezvousDto } from './dto/create-rendezvous.dto';
import { UpdateRendezvousDto } from './dto/update-rendezvous.dto';

@Controller('rendezvous')
export class RendezvousController {
  constructor(private readonly rendezvousService: RendezvousService) {}

  @Post()
  create(@Body() createRendezvousDto: CreateRendezvousDto) {
    return this.rendezvousService.create(createRendezvousDto);
  }

  @Get()
  findAll() {
    return this.rendezvousService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rendezvousService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRendezvousDto: UpdateRendezvousDto) {
    return this.rendezvousService.update(+id, updateRendezvousDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rendezvousService.remove(+id);
  }
}
