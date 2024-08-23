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

    @IsMongoId()
    @IsNotEmpty()
    userId: string;
}
