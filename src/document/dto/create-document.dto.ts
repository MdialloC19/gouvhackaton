// create-document.dto.ts

import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateDocumentDto {
    @IsString()
    @IsNotEmpty()
    originalname: string;

    @IsString()
    @IsNotEmpty()
    mimetype: string;

    @IsNotEmpty()
    size: number;

    @IsString()
    @IsNotEmpty()
    buffer: Buffer; // Buffer peut nécessiter une transformation pour les validations

    @IsString()
    name?: string; // Facultatif

    @IsString()
    path?: string; // Facultatif

    @IsDate()
    date?: Date; // Facultatif
}
