import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Citoyen, CitoyenSchema } from './citoyen.schema';
import { CitoyenService } from './citoyen.service';
import { CitoyenController } from './citoyen.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Citoyen.name, schema: CitoyenSchema },
        ]),
    ],
    providers: [CitoyenService],
    controllers: [CitoyenController],
    exports: [CitoyenService],
})
export class CitoyenModule {}
