import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsArray,
    IsUUID,
    ValidateNested,
    IsBoolean,
    IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { EnumFieldType } from '../field.schema';
import { Type } from 'class-transformer';

class FieldTypeDto {
    @IsString()
    typeName: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    options?: string[];
}

class FormFieldDto {
    @IsUUID()
    uuid: string;

    @IsString()
    name: string;

    @ValidateNested()
    @Type(() => FieldTypeDto)
    type: FieldTypeDto;

    @IsBoolean()
    required: boolean;
}

export class CreateServiceDto {
    @ApiProperty({
        description: 'Nom du service administratif',
        example: 'Renouvellement de passeport',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Catégorie du service',
        example: 'Documents administratifs',
    })
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty({
        description: 'Nom du document associé au service',
        example: 'Passeport',
    })
    @IsString()
    @IsNotEmpty()
    documentName: string;

    @ApiProperty({
        description: 'Frais du service (optionnel)',
        example: 5000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    fees?: number;

    @ApiProperty({
        description: 'Durée de traitement du service',
        example: '5 jours ouvrés',
    })
    @IsString()
    @IsNotEmpty()
    processingTime: string;

    @ApiProperty({
        description: 'Description détaillée du service',
        example: 'Ce service permet de renouveler votre passeport.',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: "Lien vers plus d'informations sur le service",
        example: 'https://example.com/services/renouvellement-passeport',
    })
    @IsUrl()
    @IsNotEmpty()
    link: string;

    @ApiProperty({
        description:
            'Liste des institutions fournissant ce service (optionnel)',
        example: ['603d4c2f9f1b2c001f8b4567', '603d4c2f9f1b2c001f8b4568'],
        required: false,
        type: [String],
    })
    @IsArray()
    @IsOptional()
    institutionsIds?: Types.ObjectId[];

    @ApiProperty({
        description: 'Liste des champs requis pour ce service (optionnel)',
        required: false,
        type: 'array',
        items: {
            type: 'object',
            properties: {
                label: { type: 'string', example: 'Nom complet' },
                fieldType: {
                    type: 'string',
                    enum: [
                        'INPUT',
                        'SELECT',
                        'UPLOAD_FILE',
                        'UPLOAD_IMAGE',
                        'DATE',
                    ],
                    example: EnumFieldType.TEXT,
                },
                required: { type: 'boolean', example: true },
                options: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Option 1', 'Option 2'],
                },
                min: { type: 'number', example: 1 },
                max: { type: 'number', example: 100 },
                filetype: { type: 'string', example: 'pdf' },
                step: { type: 'number', example: 1 },
            },
        },
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FormFieldDto)
    formFields: FormFieldDto[];

    // @IsArray()
    // @IsString({ each: true })
    // availableInstitutionsIds: string[];
}
