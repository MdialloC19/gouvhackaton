import { Module } from '@nestjs/common';
import { RendezvousService } from './rendezvous.service';
import { RendezvousController } from './rendezvous.controller';

@Module({
    controllers: [RendezvousController],
    providers: [RendezvousService],
})
export class RendezvousModule {}
