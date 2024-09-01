import {
    IsString,
    IsNotEmpty,
    IsDate,
    IsOptional,
    IsNumber,
} from 'class-validator';
import { Types } from 'mongoose';

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
    buffer: Buffer;

    @IsString()
    name?: string;

    @IsString()
    path?: string;

    @IsDate()
    date?: Date;

    @IsOptional()
    @IsNotEmpty()
    uploadedBy: Types.ObjectId;
}
