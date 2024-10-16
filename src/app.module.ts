import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { Citoyen, CitoyenSchema } from './citoyen/citoyen.schema';
import {
    Fonctionnaire,
    FonctionnaireSchema,
} from './fonctionnaire/fonctionnaire.schema';
import {
    Institution,
    InstitutionSchema,
} from './institution/institution.schema';
import { Service, ServiceSchema } from './service/service.schema';

import { DocumentEntity, DocumentSchema } from './document/document.schema';
import { Rendezvous, RendezvousSchema } from './rendezvous/rendezvous.schema';
import { FonctionnaireModule } from './fonctionnaire/fonctionnaire.module';
import { ServiceModule } from './service/service.module';
import { DocumentModule } from './document/document.module';
import { RequestModule } from './request/request.module';
import { CitoyenModule } from './citoyen/citoyen.module';
import { RendezvousModule } from './rendezvous/rendezvous.module';
import { InstitutionModule } from './institution/institution.module';
import { AdminModule } from './admin/admin.module';
import { RequestSchema } from './request/request.schema';
import { FonctionnaireAuthModule } from './auth/fonctionnaire/fonctionnaire.auth.module';
import { CitoyenAuthModule } from './auth/citoyen/citoyen.auth.module';


@Module({
    imports: [
        ConfigModule,
        MongooseModule.forRoot(process.env.MONGO_URI),
        UsersModule,
        MongooseModule.forFeature([
            { name: Request.name, schema: RequestSchema },
            { name: Citoyen.name, schema: CitoyenSchema },
            { name: Fonctionnaire.name, schema: FonctionnaireSchema },
            { name: Institution.name, schema: InstitutionSchema },
            { name: Service.name, schema: ServiceSchema },
            { name: DocumentEntity.name, schema: DocumentSchema },
            { name: Rendezvous.name, schema: RendezvousSchema },
        ]),
        FonctionnaireModule,
        ServiceModule,
        DocumentModule,
        RequestModule,
        CitoyenModule,
        RendezvousModule,
        InstitutionModule,
        AdminModule,
        FonctionnaireAuthModule,
        CitoyenAuthModule
       
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
