import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forRoot(process.env.MONGO_URI),
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
