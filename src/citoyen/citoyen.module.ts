import { Module } from '@nestjs/common';
import { CitoyenService } from './citoyen.service';
import { CitoyenController } from './citoyen.controller';

@Module({
  controllers: [CitoyenController],
  providers: [CitoyenService],
})
export class CitoyenModule {}
