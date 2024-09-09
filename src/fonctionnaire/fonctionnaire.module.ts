import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FonctionnaireService } from './fonctionnaire.service';
import { FonctionnaireController } from './fonctionnaire.controller';
import { Fonctionnaire, FonctionnaireSchema } from './fonctionnaire.schema';
import { InstitutionModule } from '../institution/institution.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Fonctionnaire.name, schema: FonctionnaireSchema },
        ]),
        InstitutionModule,
    ],
    controllers: [FonctionnaireController],
    providers: [FonctionnaireService],
    exports: [FonctionnaireService],
})
export class FonctionnaireModule {}
