export class SmsModule {}
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsService } from './services/sms/sms.service';
import { SmsSchema } from './schemas/sms.schema'; // Assurez-vous de définir le schéma pour SMS
import { UsersSchema } from './../../users/schemas/users.schema';
import { ConfigModule } from '@nestjs/config';
import { SmsController } from './controllers/sms/sms.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Sms', schema: SmsSchema }]),
        MongooseModule.forFeature([{ name: 'User', schema: UsersSchema }]),
        ConfigModule,
    ],

    providers: [SmsService],
    controllers: [SmsController],
    exports: [SmsService],
})
export class SMSModule {}
