import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class UpdateCompteDto {
    @IsOptional()
    @IsNumber()
    idCardNumber?: number;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsBoolean()
    isConfirmed?: boolean;
}
