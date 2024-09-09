import {
    IsString,
    IsDate,
    IsOptional,
    IsNotEmpty,
    IsPhoneNumber,
    IsStrongPassword,
} from 'class-validator';

export class CreateCitoyenDto {
    @IsString()
    @IsNotEmpty()
    readonly CNI: string;

    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    readonly phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly surname: string;

    @IsOptional()
    @IsDate()
    readonly birthday?: Date;

    @IsOptional()
    @IsString()
    readonly job?: string;

    @IsString()
    readonly sex: string;

    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    readonly password: string;

    @IsOptional()
    @IsString()
    readonly fathersName?: string;

    @IsOptional()
    @IsString()
    readonly fathersSurname?: string;

    @IsOptional()
    @IsString()
    readonly mothersName?: string;

    @IsOptional()
    @IsString()
    readonly mothersSurname?: string;

    @IsOptional()
    @IsString()
    readonly maritalStatus?: string;

    @IsOptional()
    @IsString()
    readonly address?: string;
}
