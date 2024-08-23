import {
    IsString,
    IsNotEmpty,
    IsBoolean,
    IsNumber,
    IsMongoId,
} from 'class-validator';

export class CreateCompteDto {
    @IsNumber()
    @IsNotEmpty()
    idCardNumber: number;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsBoolean()
    isConfirmed?: boolean;

    @IsString()
    otp?: string;

    @IsMongoId()
    @IsNotEmpty()
    userId: string;
}
