import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rendezvous, RendezvousSchema } from './rendezvous.schema';
import { RendezvousService } from './rendezvous.service';
import { RendezvousController } from './rendezvous.controller';
import { CitoyenModule } from '../citoyen/citoyen.module';
import { InstitutionModule } from '../institution/institution.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Rendezvous.name, schema: RendezvousSchema },
        ]),
        CitoyenModule,
        InstitutionModule,
    ],
    providers: [RendezvousService],
    controllers: [RendezvousController],
})
export class RendezvousModule {}
