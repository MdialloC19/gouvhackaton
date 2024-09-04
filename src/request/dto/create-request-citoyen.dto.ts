import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    citoyen: string;

    @IsNotEmpty()
    @IsMongoId()
    service: string;

    @IsNotEmpty()
    @IsMongoId()
    institution: string;

    @IsOptional()
    commentByCitoyen: string;

    @IsOptional()
    dateAndHour: Date;

    @IsOptional()
    textResponses: Record<string, string>;

    @IsOptional()
    documentResponses: Record<string, Types.ObjectId>;
}
