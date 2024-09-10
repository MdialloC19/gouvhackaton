import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateRequestDto {
    @ApiProperty({
        description: "ID du citoyen effectuant la demande",
        example: '603d4c2f9f1b2c001f8b4567',
    })
    @IsNotEmpty()
    @IsMongoId()
    citoyen: Types.ObjectId;

    @ApiProperty({
        description: "ID du service demandé",
        example: '603d4c2f9f1b2c001f8b4568',
    })
    @IsNotEmpty()
    @IsMongoId()
    service: Types.ObjectId;

    @ApiProperty({
        description: "ID de l'institution ,fournissant le service , choisie par le citoyen",
        example: '603d4c2f9f1b2c001f8b4569',
    })
    @IsNotEmpty()
    @IsMongoId()
    institution: Types.ObjectId;

    @ApiProperty({
        description: "Commentaire facultatif laissé par le citoyen",
        example: 'Je souhaite un rendez-vous à 14h.',
        required: false,
    })
    @IsOptional()
    commentByCitoyen: string;

    @ApiProperty({
        description: "Date et heure de la demandes",
        example: '2024-01-01T14:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @Type(() => Date)
    dateAndHour: Date;

    @ApiProperty({
        description: "Réponses textuelles du citoyen pour le service (optionnel)",
        example: {
            "nom_complet": "John Doe",
            "adresse": "123 Rue Principale",
        },
        required: false,
    })
    @IsOptional()
    textResponses: Record<string, string>;

    @ApiProperty({
        description: "Réponses sous forme de documents du citoyen pour le service (optionnel)",
        example: {
            "document_identite": "603d4c2f9f1b2c001f8b4570",
        },
        required: false,
    })
    @IsOptional()
    documentResponses: Record<string, Types.ObjectId>;
}
