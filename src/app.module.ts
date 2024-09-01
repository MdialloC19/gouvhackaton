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
import {
    FormResponse,
    FormResponseSchema,
} from './form-response/formResponse.schema';
import { DocumentEntity, DocumentSchema } from './document/document.schema';
import { Rendezvous, RendezvousSchema } from './rendezvous/rendezvous.schema';
import { FonctionnaireModule } from './fonctionnaire/fonctionnaire.module';
import { ServiceModule } from './service/service.module';
import { DocumentModule } from './document/document.module';
import { RequestModule } from './request/request.module';
import { FormResponseModule } from './form-response/form-response.module';
import { CitoyenModule } from './citoyen/citoyen.module';
import { RendezvousModule } from './rendezvous/rendezvous.module';
import { InstitutionModule } from './institution/institution.module';
import { AdminModule } from './admin/admin.module';
import { RequestSchema } from './request/request.schema';
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
            { name: FormResponse.name, schema: FormResponseSchema },
            { name: DocumentEntity.name, schema: DocumentSchema },
            { name: Rendezvous.name, schema: RendezvousSchema },
        ]),
        FonctionnaireModule,
        ServiceModule,
        DocumentModule,
        RequestModule,
        FormResponseModule,
        CitoyenModule,
        RendezvousModule,
        InstitutionModule,
        AdminModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
