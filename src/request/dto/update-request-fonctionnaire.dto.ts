import {
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsArray,
    IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

enum RequestState {
    EnCours = 'en-cours',
    Termine = 'terminé',
    Rejete = 'rejeté',
}

export class UpdateRequestDto {
    @ApiProperty({
        description: 'Date et heure du traitement de la demande (optionnel)',
        example: '2024-01-02T15:30:00.000Z',
        required: false,
    })
    @IsOptional()
    dateAndHourTreatment: Date;

    @ApiProperty({
        description: 'État actuel de la demande',
        example: 'en-cours',
        enum: RequestState,
    })
    @IsNotEmpty()
    @IsEnum(RequestState)
    state: RequestState;

    @ApiProperty({
        description: "Commentaire ajouté par l'agent traitant la demande (optionnel)",
        example: 'Le dossier est complet et en cours de traitement.',
        required: false,
    })
    @IsOptional()
    commentByAgent: string;

    @ApiProperty({
        description: "Documents ajoutés par l'agent traitant (optionnel), il faut d'abord ajouter les documents avec l'endpoint documents",
        example: ['603d4c2f9f1b2c001f8b4571', '603d4c2f9f1b2c001f8b4572'],
        required: false,
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    documentsByAgent: string[];

    @ApiProperty({
        description: "Liste des agents ayant traité la demande",
        example: ['603d4c2f9f1b2c001f8b4573', '603d4c2f9f1b2c001f8b4574'],
        type: [String],
    })
    @IsNotEmpty()
    @IsArray()
    @IsMongoId({ each: true })
    processedBy: string[];
}
