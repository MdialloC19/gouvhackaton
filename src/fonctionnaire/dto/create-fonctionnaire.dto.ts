import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFonctionnaireDto {
    @ApiProperty({
        description: 'CNI du fonctionnaire',
        example: '1234567890123',
    })
    @IsString()
    @IsNotEmpty()
    readonly CNI: string;

    @ApiProperty({
        description: 'Numéro de téléphone du fonctionnaire',
        example: '+221777123456',
    })
    @IsNotEmpty()
    @IsString()
    readonly phoneNumber: string;

    @ApiProperty({
        description: 'Nom du fonctionnaire',
        example: 'Jean',
    })
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @ApiProperty({
        description: 'Prénom du fonctionnaire',
        example: 'Dupont',
    })
    @IsNotEmpty()
    @IsString()
    readonly surname: string;

    @ApiProperty({
        description: 'Date de naissance du fonctionnaire',
        example: '1990-01-01',
        type: String,
    })
    @IsOptional()
    @IsDate()
    readonly birthDate?: Date;

    @ApiProperty({
        description: 'Profession du fonctionnaire',
        example: 'Ingénieur',
        required: false,
    })
    @IsOptional()
    @IsString()
    readonly job?: string;

    @ApiProperty({
        description: 'Sexe du fonctionnaire',
        example: 'M',
    })
    @IsString()
    readonly sex: string;

    @ApiProperty({
        description: 'Mot de passe du fonctionnaire',
        example: 'Str0ngP@ssw0rd!',
    })
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({
        description: "Numéro d'identification du fonctionnaire",
        example: 'ID123456',
    })
    @IsString()
    @IsNotEmpty()
    readonly idNumber: string;

    @ApiProperty({
        description: 'Email du fonctionnaire',
        example: 'jean.dupont@example.com',
    })
    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({
        description: 'Rôle du fonctionnaire',
        example: 'Admin',
    })
    @IsString()
    @IsNotEmpty()
    readonly role: string;

    @ApiProperty({
        description: "Nom de l'institution où le fonctionnaire travaille",
        example: 'Université de Dakar',
    })
    @IsString()
    @IsNotEmpty()
    readonly institutionId: string;
}
