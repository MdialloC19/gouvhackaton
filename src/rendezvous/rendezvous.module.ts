import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RendezvousService } from './rendezvous.service';
import { RendezvousController } from './rendezvous.controller';
import { RendezvousSchema } from './rendezvous.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Rendezvous', schema: RendezvousSchema }]),
    ],
    providers: [RendezvousService],
    controllers: [RendezvousController],
    exports: [RendezvousService],
})
export class RendezvousModule {}
