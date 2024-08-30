import { Controller } from '@nestjs/common';
import { FonctionnaireService } from './fonctionnaire.service';

@Controller('fonctionnaire')
export class FonctionnaireController {
  constructor(private readonly fonctionnaireService: FonctionnaireService) {}
}
