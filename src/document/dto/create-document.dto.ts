import {
    IsString,
    IsNotEmpty,
    IsDate,
    IsOptional,
    IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateDocumentDto {
    @ApiProperty({
        description: 'Nom original du document',
        example: 'resume.pdf',
    })
    @IsString()
    @IsNotEmpty()
    originalname: string;

    @ApiProperty({
        description: 'Type MIME du document',
        example: 'application/pdf',
    })
    @IsString()
    @IsNotEmpty()
    mimetype: string;

    @ApiProperty({
        description: 'Taille du document en octets',
        example: 123456,
    })
    @IsNotEmpty()
    @IsNumber()
    size: number;

    @ApiProperty({
        description: 'Contenu du document en format binaire (buffer)',
        example: 'Buffer data here',  
    })
    @IsString()
    @IsNotEmpty()
    buffer: Buffer;

    @ApiProperty({
        description: 'Nom donné au document (optionnel)',
        example: 'CV_John_Doe',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'Chemin d\'accès du document (optionnel)',
        example: '/documents/1234567890.pdf',
        required: false,
    })
    @IsOptional()
    @IsString()
    path?: string;

    @ApiProperty({
        description: 'Date de création du document (optionnel)',
        example: '2024-01-01T00:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDate()
    date?: Date;

    @ApiProperty({
        description: 'ID de l\'utilisateur ayant téléchargé le document (optionnel)',
        example: '603d4c2f9f1b2c001f8b4567',
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    uploadedBy?: Types.ObjectId;
}
