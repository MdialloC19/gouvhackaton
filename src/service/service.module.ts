import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './service.schema';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { InstitutionModule } from 'src/institution/institution.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),InstitutionModule],
  providers: [ServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {}
