import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ComptesModule } from './comptes/comptes.module';
import { SmsModule } from './utils/sms/sms.module';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forRoot(process.env.MONGO_URI),
        UsersModule,
        ComptesModule,
        SmsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
