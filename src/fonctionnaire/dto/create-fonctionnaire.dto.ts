import {
    IsString,
    IsNotEmpty,
    IsDate,
    IsOptional,
    IsPhoneNumber,
    IsStrongPassword,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateFonctionnaireDto {
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

    @IsString()
    @IsNotEmpty()
    readonly idNumber: string;

    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly role: string;

    @IsString()
    @IsNotEmpty()
    readonly institutionName: string;
}
