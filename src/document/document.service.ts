import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentEntity } from './document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentService {
    constructor(
        @InjectModel(DocumentEntity.name)
        private readonly documentModel: Model<DocumentEntity>,
    ) {}

    async createDocument(
        createDocumentDto: CreateDocumentDto,
    ): Promise<DocumentEntity> {
        const newDocument = new this.documentModel(createDocumentDto);
        return newDocument.save();
    }

    async getDocumentById(id: string): Promise<DocumentEntity> {
        const document = await this.documentModel.findById(id).exec();
        if (!document) {
            throw new NotFoundException(`Document with ID ${id} not found`);
        }
        return document;
    }

    async getDocumentByName(name: string): Promise<DocumentEntity> {
        const document = await this.documentModel.findOne({ name }).exec();
        if (!document) {
            throw new NotFoundException(`Document with ID ${name} not found`);
        }
        return document;
    }

    async getAllDocuments(): Promise<DocumentEntity[]> {
        return this.documentModel.find().exec();
    }

    async remove(id: string): Promise<DocumentEntity> {
        const deletedDocument = await this.documentModel
            .findByIdAndDelete(id)
            .exec();
        if (!deletedDocument) {
            throw new NotFoundException(`Document with ID ${id} not found`);
        }
        return deletedDocument;
    }
}
