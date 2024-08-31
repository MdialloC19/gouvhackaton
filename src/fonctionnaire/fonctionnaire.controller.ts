import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
} from '@nestjs/common';
import { FonctionnaireService } from './fonctionnaire.service';
import { CreateFonctionnaireDto } from './dto/create-fonctionnaire.dto';
import { UpdateFonctionnaireDto } from './dto/update-fonctionnaire.dto';

@Controller('fonctionnaires')
export class FonctionnaireController {
    constructor(private readonly fonctionnaireService: FonctionnaireService) {}

    @Post()
    create(@Body() createFonctionnaireDto: CreateFonctionnaireDto) {
        return this.fonctionnaireService.create(createFonctionnaireDto);
    }

    @Get()
    findAll() {
        return this.fonctionnaireService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.fonctionnaireService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateFonctionnaireDto: UpdateFonctionnaireDto,
    ) {
        return this.fonctionnaireService.update(id, updateFonctionnaireDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.fonctionnaireService.remove(id);
    }
}
