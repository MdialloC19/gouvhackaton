import { Module } from '@nestjs/common';
import { FonctionnaireService } from './fonctionnaire.service';
import { FonctionnaireController } from './fonctionnaire.controller';

@Module({
  controllers: [FonctionnaireController],
  providers: [FonctionnaireService],
})
export class FonctionnaireModule {}
