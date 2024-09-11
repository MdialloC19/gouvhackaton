import {
    IsString,
    IsDate,
    IsOptional,
    IsNumber,
    IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateRendezvousDto {
    @ApiProperty({
        description: 'ID du citoyen ayant demandé le rendez-vous',
        example: '603d4c2f9f1b2c001f8b4567',
    })
    @IsMongoId()
    readonly citoyen?: Types.ObjectId;

    @ApiProperty({
        description:
            "ID de l'institution administrative où le rendez-vous est prévu",
        example: '603d4c2f9f1b2c001f8b4567',
    })
    @IsMongoId()
    readonly institution?: Types.ObjectId;

    @ApiProperty({
        description: 'Date et heure du rendez-vous',
        example: '2024-01-01T10:00:00.000Z',
    })
    @IsDate()
    readonly dateAndHour: Date;

    @ApiProperty({
        description: 'Durée estimée du rendez-vous en minutes (optionnel)',
        example: 45,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    readonly duration?: number;

    @ApiProperty({
        description:
            'État actuel du rendez-vous (ex: Confirmé, Annulé) (optionnel)',
        example: 'Confirmé',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly state?: string;

    @ApiProperty({
        description: 'Priorité du rendez-vous (ex: Urgent, Normal) (optionnel)',
        example: 'Normal',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly priority?: string;

    @ApiProperty({
        description:
            'Type de rendez-vous (ex: Renouvellement de passeport, Dépôt de dossier) (optionnel)',
        example: 'Renouvellement de passeport',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly type?: string;

    @ApiProperty({
        description:
            'Commentaire sur le rendez-vous (ex: Documents à apporter, autres précisions) (optionnel)',
        example: 'Le citoyen doit apporter une copie de son passeport.',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly comment?: string;
}
