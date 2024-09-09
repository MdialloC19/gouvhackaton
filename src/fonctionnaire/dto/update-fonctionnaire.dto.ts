import { PartialType } from '@nestjs/mapped-types';
import { CreateFonctionnaireDto } from './create-fonctionnaire.dto';

export class UpdateFonctionnaireDto extends PartialType(
    CreateFonctionnaireDto,
) {}
