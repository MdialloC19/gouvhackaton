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
    Query,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentEntity } from './document.schema';
import { Types } from 'mongoose';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Query('userId') userId: string,
    ) {
        const documentData: CreateDocumentDto = {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
            name: file.originalname,
            path: '',
            date: new Date(),
            uploadedBy: new Types.ObjectId(userId),
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
