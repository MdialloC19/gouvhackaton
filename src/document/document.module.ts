import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentEntity, DocumentSchema } from './document.schema';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DocumentEntity.name, schema: DocumentSchema },
        ]),
    ],
    controllers: [DocumentController],
    providers: [DocumentService],
    exports: [DocumentService],
})
export class DocumentModule {}
