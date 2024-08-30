import { PartialType } from '@nestjs/mapped-types';
import { CreateCitoyenDto } from './create-citoyen.dto';

export class UpdateCitoyenDto extends PartialType(CreateCitoyenDto) {}
