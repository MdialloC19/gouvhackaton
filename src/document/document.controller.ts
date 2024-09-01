// document.controller.ts
import { Response } from 'express';
import {
    Controller,
    Post,
    Get,
    Param,
    UseInterceptors,
    UploadedFile,
    NotFoundException,
    Res,
    Delete,
} from '@nestjs/common';
import { DocumentService } from './document.service'; // Assurez-vous du chemin correct
import { CreateDocumentDto } from './dto/create-document.dto'; // Assurez-vous du chemin correct
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentEntity } from './document.schema';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const documentData: CreateDocumentDto = {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
            name: file.originalname, // Exemple de nom
            path: '', // Exemple de chemin, à adapter selon vos besoins
            date: new Date(), // Date actuelle
        };
        return this.documentService.createDocument(documentData);
    }

    @Get(':id')
    async getDocumentById(@Param('id') id: string, @Res() res: Response) {
        const document = await this.documentService.getDocumentById(id);
        if (!document) {
            throw new NotFoundException(`Document with ID ${id} not found`);
        }

        res.setHeader('Content-Type', document.mimetype);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${document.originalname}"`,
        );
        res.send(document.buffer);
    }

    @Get()
    async getAllDocuments() {
        const documents = await this.documentService.getAllDocuments();
        return {
            statusCode: 200,
            message: 'Documents retrieved successfully',
            data: documents,
        };
    }
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<DocumentEntity> {
        return this.documentService.remove(id);
    }
}
