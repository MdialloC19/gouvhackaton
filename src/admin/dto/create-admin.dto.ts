import {
    IsString,
    IsEmail,
    IsOptional,
    IsDate,
    IsNotEmpty,
    IsPhoneNumber,
    IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
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
        example: 'Directeur des opérations',
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
        description: 'Mot de passe sécurisé pour l\'admin',
        example: 'Str0ngP@ssw0rd!',
    })
    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({
        description: 'Adresse email de l\'admin',
        example: 'aminata.diop@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}
