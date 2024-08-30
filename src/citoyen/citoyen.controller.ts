import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CitoyenService } from './citoyen.service';
import { CreateCitoyenDto } from './dto/create-citoyen.dto';
import { UpdateCitoyenDto } from './dto/update-citoyen.dto';

@Controller('citoyen')
export class CitoyenController {
  constructor(private readonly citoyenService: CitoyenService) {}

  @Post()
  create(@Body() createCitoyenDto: CreateCitoyenDto) {
    return this.citoyenService.create(createCitoyenDto);
  }

  @Get()
  findAll() {
    return this.citoyenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citoyenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitoyenDto: UpdateCitoyenDto) {
    return this.citoyenService.update(+id, updateCitoyenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citoyenService.remove(+id);
  }
}
