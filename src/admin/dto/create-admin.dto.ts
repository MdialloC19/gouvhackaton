import { IsString, IsEmail, IsOptional, IsDate } from 'class-validator';

export class CreateAdminDto {
    @IsString()
    readonly CNI: string;

    @IsString()
    readonly phoneNumber: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly surname: string;

    @IsOptional()
    @IsDate()
    readonly birthday?: Date;

    @IsOptional()
    @IsString()
    readonly job?: string;

    @IsString()
    readonly sex: string; // EnumSex, replace this string type with the actual enum if available

    @IsString()
    readonly password: string;

    @IsEmail()
    readonly email: string;
}
