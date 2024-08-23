import { Module } from '@nestjs/common';
import { ComptesController } from './controllers/comptes/comptes.controller';
import { ComptesService } from './services/comptes/comptes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ComptesSchema } from './schemas/comptes.schema';
import { SmsSchema } from 'src/utils/sms/schemas/sms.schema';
import { SmsService } from 'src/utils/sms/services/sms/sms.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Compte', schema: ComptesSchema },
            { name: 'Sms', schema: SmsSchema },
        ]),
        UsersModule,
    ],
    providers: [ComptesService, SmsService],
    controllers: [ComptesController],
})
export class ComptesModule {}
