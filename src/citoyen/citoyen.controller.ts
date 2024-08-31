import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CitoyenService } from './citoyen.service';
import { CreateCitoyenDto } from './dto/create-citoyen.dto';
import { UpdateCitoyenDto } from './dto/update-citoyen.dto';
import { Citoyen } from './citoyen.schema';

@Controller('citoyens')
export class CitoyenController {
  constructor(private readonly citoyenService: CitoyenService) {}

  @Post()
  create(@Body() createCitoyenDto: CreateCitoyenDto): Promise<Citoyen> {
    return this.citoyenService.create(createCitoyenDto);
  }

  @Get()
  findAll(): Promise<Citoyen[]> {
    return this.citoyenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Citoyen> {
    return this.citoyenService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCitoyenDto: UpdateCitoyenDto): Promise<Citoyen> {
    return this.citoyenService.update(id, updateCitoyenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.citoyenService.remove(id);
  }
}
