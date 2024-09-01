import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Request, RequestSchema } from './request.schema';
import { DocumentModule } from '../document/document.module';
import { ServiceModule } from '../service/service.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Request.name, schema: RequestSchema },
        ]),
        DocumentModule,
        ServiceModule,
    ],
    providers: [RequestService],
    controllers: [RequestController],
    exports: [RequestService],
})
export class RequestModule {}
