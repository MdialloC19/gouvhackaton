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
    typeName: EnumFieldType;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    options?: string[];
}

export class FormFieldDto {
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
    institutions?: Types.ObjectId[];

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
    fields: FormFieldDto[];

    @ApiProperty({
        description: 'Qui peut faire la demande',
        example: "Tout citoyen possédant une carte d'identité nationale valide",
    })
    @IsOptional()
    @IsString()
    whoCanMakeRequest: string;

    @ApiProperty({
        description: 'Structure responsable de la gestion du service',
        example: "Ministère de l'Intérieur",
    })
    @IsString()
    @IsOptional()
    structureInCharge: string;

    @ApiProperty({
        description: 'Institution compétente pour le service',
        example: "Direction de l'Identification Civile",
    })
    @IsOptional()
    @IsString()
    competentInstitution: string;

    @ApiProperty({
        description: 'Heures de service',
        example: 'Lundi à vendredi, de 9h à 17h',
    })
    @IsString()
    @IsOptional()
    serviceHours: string;

    @ApiProperty({
        description: 'Étapes à suivre pour compléter le service',
        example: [
            'Étape 1 : Remplir le formulaire en ligne',
            'Étape 2 : Soumettre les documents justificatifs',
            'Étape 3 : Attendre la confirmation',
        ],
    })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    stepsToFollow: string[];

    @ApiProperty({
        description: "Lien YouTube pour plus d'informations sur le service",
        example: 'https://www.youtube.com/watch?v=exemple',
    })
    @IsUrl()
    @IsOptional()
    youtubeLink?: string;

    @ApiProperty({
        description: 'Lien vers une explication vocale en wolof sur le service',
        example: 'https://exemple.com/wolof-voice-service',
    })
    @IsUrl()
    @IsOptional()
    wolofVoiceLink?: string;
}
