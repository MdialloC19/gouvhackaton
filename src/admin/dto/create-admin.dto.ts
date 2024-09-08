import {
    IsString,
    IsEmail,
    IsOptional,
    IsDate,
    IsNotEmpty,
    IsPhoneNumber,
    IsStrongPassword,
} from 'class-validator';

export class CreateAdminDto {
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


    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}
