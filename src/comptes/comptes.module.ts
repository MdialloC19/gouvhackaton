import { Module } from '@nestjs/common';
import { ComptesController } from './controllers/comptes/comptes.controller';
import { ComptesService } from './services/comptes/comptes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ComptesSchema } from './schemas/comptes.schema';
import { UsersSchema } from '../users/schemas/users.schema';
import { UsersService } from '../users/services/users/users.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Comptes', schema: ComptesSchema }]),
        MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    ],

    providers: [ComptesService, UsersService],
    controllers: [ComptesController],
})
export class ComptesModule {}
