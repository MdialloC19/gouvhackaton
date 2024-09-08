import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    NotFoundException,
    InternalServerErrorException,
    Res,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentEntity } from './document.schema';
import { ApiResponse } from '../interface/apiResponses.interface';
import { Response } from 'express';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    // Citoyen, Fonctionnaire
    @Post()
    async create(
        @Body() createDocumentDto: CreateDocumentDto,
    ): Promise<ApiResponse<DocumentEntity>> {
        try {
            const document =
                await this.documentService.createDocument(createDocumentDto);
            return {
                status: 'success',
                message: 'Document created successfully',
                data: document,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to create document',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get(':id')
    async getById(
        @Param('id') id: string,
    ): Promise<ApiResponse<DocumentEntity>> {
        try {
            const document = await this.documentService.getDocumentById(id);
            return {
                status: 'success',
                message: 'Document retrieved successfully',
                data: document,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve document',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get('name')
    async getByName(
        @Query('name') name: string,
    ): Promise<ApiResponse<DocumentEntity>> {
        try {
            const document = await this.documentService.getDocumentByName(name);
            return {
                status: 'success',
                message: 'Document retrieved successfully',
                data: document,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve document',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get()
    async getAll(): Promise<ApiResponse<DocumentEntity[]>> {
        try {
            const documents = await this.documentService.getAllDocuments();
            return {
                status: 'success',
                message: 'Documents retrieved successfully',
                data: documents,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve documents',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get('/file/:id')
    async getDocumentById(@Param('id') id: string, @Res() res: Response) {
        const document = await this.documentService.getBuffer(id);
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

    // Citoyen, Fonctionnaire , Admin
    @Delete(':id')
    async remove(
        @Param('id') id: string,
    ): Promise<ApiResponse<DocumentEntity>> {
        try {
            const deletedDocument = await this.documentService.remove(id);
            return {
                status: 'success',
                message: 'Document deleted successfully',
                data: deletedDocument,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to delete document',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire , Admin
    @Get('user/:userId')
    async getByUploadedBy(
        @Param('userId') userId: string,
    ): Promise<ApiResponse<DocumentEntity[]>> {
        try {
            const documents =
                await this.documentService.getDocumentsByUploadedBy(userId);
            return {
                status: 'success',
                message: 'Documents retrieved successfully',
                data: documents,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Failed to retrieve documents',
                data: null,
            });
        }
    }
}
