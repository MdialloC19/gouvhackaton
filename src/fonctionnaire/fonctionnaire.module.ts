import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FonctionnaireService } from './fonctionnaire.service';
import { FonctionnaireController } from './fonctionnaire.controller';
import { Fonctionnaire, FonctionnaireSchema } from './fonctionnaire.schema';
import { InstitutionModule } from '../institution/institution.module'; // Import du module Institution

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Fonctionnaire.name, schema: FonctionnaireSchema },
        ]),
        InstitutionModule, // Assurez-vous d'importer le module Institution
    ],
    controllers: [FonctionnaireController],
    providers: [FonctionnaireService],
})
export class FonctionnaireModule {}
