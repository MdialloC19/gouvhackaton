import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Institution, InstitutionSchema } from './institution.schema';
import { InstitutionService } from './institution.service';
import { InstitutionController } from './institution.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Institution.name, schema: InstitutionSchema },
        ]),
    ],
    controllers: [InstitutionController],
    providers: [InstitutionService],
    exports: [InstitutionService],
})
export class InstitutionModule {}
