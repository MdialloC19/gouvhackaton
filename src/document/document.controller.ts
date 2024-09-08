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
import {
    ApiTags,
    ApiOperation,
    ApiResponse as SwaggerApiResponse,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    // Citoyen, Fonctionnaire
    @Post()
    @ApiOperation({ summary: 'Créer un nouveau document' })
    @ApiBody({ type: CreateDocumentDto })
    @SwaggerApiResponse({ status: 201, description: 'Document créé avec succès.', type: DocumentEntity })
    @SwaggerApiResponse({ status: 500, description: 'Échec de la création du document.' })
    async create(
        @Body() createDocumentDto: CreateDocumentDto,
    ): Promise<ApiResponse<DocumentEntity>> {
        try {
            const document =
                await this.documentService.createDocument(createDocumentDto);
            return {
                status: 'success',
                message: 'Document créé avec succès',
                data: document,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la création du document',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get(':id')
    @ApiOperation({ summary: 'Obtenir un document par ID' })
    @ApiParam({ name: 'id', description: 'ID du document', type: String })
    @SwaggerApiResponse({ status: 200, description: 'Document récupéré avec succès.', type: DocumentEntity })
    @SwaggerApiResponse({ status: 404, description: 'Document non trouvé.' })
    @SwaggerApiResponse({ status: 500, description: 'Échec de la récupération du document.' })
    async getById(
        @Param('id') id: string,
    ): Promise<ApiResponse<DocumentEntity>> {
        try {
            const document = await this.documentService.getDocumentById(id);
            return {
                status: 'success',
                message: 'Document récupéré avec succès',
                data: document,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération du document',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get('name')
    @ApiOperation({ summary: 'Obtenir un document par nom' })
    @ApiQuery({ name: 'name', description: 'Nom du document', type: String })
    @SwaggerApiResponse({ status: 200, description: 'Document récupéré avec succès.', type: DocumentEntity })
    @SwaggerApiResponse({ status: 404, description: 'Document non trouvé.' })
    @SwaggerApiResponse({ status: 500, description: 'Échec de la récupération du document.' })
    async getByName(
        @Query('name') name: string,
    ): Promise<ApiResponse<DocumentEntity>> {
        try {
            const document = await this.documentService.getDocumentByName(name);
            return {
                status: 'success',
                message: 'Document récupéré avec succès',
                data: document,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération du document',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get()
    @ApiOperation({ summary: 'Obtenir tous les documents' })
    @SwaggerApiResponse({ status: 200, description: 'Documents récupérés avec succès.', type: [DocumentEntity] })
    @SwaggerApiResponse({ status: 500, description: 'Échec de la récupération des documents.' })
    async getAll(): Promise<ApiResponse<DocumentEntity[]>> {
        try {
            const documents = await this.documentService.getAllDocuments();
            return {
                status: 'success',
                message: 'Documents récupérés avec succès',
                data: documents,
            };
        } catch (error) {
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des documents',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get('/file/:id')
    @ApiOperation({ summary: 'Obtenir le fichier d\'un document par ID' })
    @ApiParam({ name: 'id', description: 'ID du document', type: String })
    @SwaggerApiResponse({ status: 200, description: 'Fichier du document récupéré avec succès.' })
    @SwaggerApiResponse({ status: 404, description: 'Document non trouvé.' })
    @SwaggerApiResponse({ status: 500, description: 'Échec de la récupération du fichier du document.' })
    async getDocumentById(@Param('id') id: string, @Res() res: Response) {
        const document = await this.documentService.getBuffer(id);
        if (!document) {
            throw new NotFoundException(`Document avec ID ${id} non trouvé`);
        }

        res.setHeader('Content-Type', document.mimetype);
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${document.originalname}"`,
        );
        res.send(document.buffer);
    }

    // Citoyen, Fonctionnaire, Admin
    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un document par ID' })
    @ApiParam({ name: 'id', description: 'ID du document', type: String })
    @SwaggerApiResponse({ status: 200, description: 'Document supprimé avec succès.', type: DocumentEntity })
    @SwaggerApiResponse({ status: 404, description: 'Document non trouvé.' })
    @SwaggerApiResponse({ status: 500, description: 'Échec de la suppression du document.' })
    async remove(
        @Param('id') id: string,
    ): Promise<ApiResponse<DocumentEntity>> {
        try {
            const deletedDocument = await this.documentService.remove(id);
            return {
                status: 'success',
                message: 'Document supprimé avec succès',
                data: deletedDocument,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la suppression du document',
                data: null,
            });
        }
    }

    // Citoyen, Fonctionnaire, Admin
    @Get('user/:userId')
    @ApiOperation({ summary: 'Obtenir les documents uploadés par un utilisateur' })
    @ApiParam({ name: 'userId', description: 'ID de l\'utilisateur', type: String })
    @SwaggerApiResponse({ status: 200, description: 'Documents récupérés avec succès pour l\'utilisateur spécifié.', type: [DocumentEntity] })
    @SwaggerApiResponse({ status: 404, description: 'Documents non trouvés pour cet utilisateur.' })
    @SwaggerApiResponse({ status: 500, description: 'Échec de la récupération des documents par utilisateur.' })
    async getByUploadedBy(
        @Param('userId') userId: string,
    ): Promise<ApiResponse<DocumentEntity[]>> {
        try {
            const documents =
                await this.documentService.getDocumentsByUploadedBy(userId);
            return {
                status: 'success',
                message: 'Documents récupérés avec succès',
                data: documents,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException({
                status: 'error',
                message: 'Échec de la récupération des documents',
                data: null,
            });
        }
    }
}
