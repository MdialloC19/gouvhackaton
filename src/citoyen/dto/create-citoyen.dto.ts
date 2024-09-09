import {
    IsString,
    IsDate,
    IsOptional,
    IsNotEmpty,
    IsPhoneNumber,
    IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCitoyenDto {
    @ApiProperty({
        description: 'CNI (Carte Nationale d’Identité) du citoyen',
        example: '1234567890123',
    })
    @IsString()
    @IsNotEmpty()
    readonly CNI: string;

    @ApiProperty({
        description: 'Numéro de téléphone du citoyen',
        example: '+221777123456',
    })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    readonly phoneNumber: string;

    @ApiProperty({
        description: 'Nom de famille du citoyen',
        example: 'Diop',
    })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'Prénom du citoyen',
        example: 'Aminata',
    })
    @IsNotEmpty()
    @IsString()
    readonly surname: string;

    @ApiProperty({
        description: 'Date de naissance du citoyen',
        example: '1990-05-15',
        required: false,
        type: String,
    })
    @IsOptional()
    @IsDate()
    readonly birthday?: Date;

    @ApiProperty({
        description: 'Profession du citoyen',
        example: 'Ingénieur',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly job?: string;

    @ApiProperty({
        description: 'Sexe du citoyen',
        example: 'F',
    })
    @IsString()
    readonly sex: string;

    @ApiProperty({
        description: 'Mot de passe sécurisé du citoyen',
        example: 'Str0ngP@ssw0rd!',
    })
    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({
        description: 'Nom du père du citoyen',
        example: 'Mamadou',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly fathersName?: string;

    @ApiProperty({
        description: 'Prénom du père du citoyen',
        example: 'Diop',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly fathersSurname?: string;

    @ApiProperty({
        description: 'Nom de la mère du citoyen',
        example: 'Fatou',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly mothersName?: string;

    @ApiProperty({
        description: 'Prénom de la mère du citoyen',
        example: 'Sarr',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly mothersSurname?: string;

    @ApiProperty({
        description: 'État civil du citoyen',
        example: 'Marié',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly maritalStatus?: string;

    @ApiProperty({
        description: 'Adresse du citoyen',
        example: '123 Rue de la Liberté, Dakar',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly address?: string;
}
