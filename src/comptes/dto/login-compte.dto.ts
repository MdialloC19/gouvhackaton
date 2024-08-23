import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class loginCompteDto {
    @IsNumber()
    @IsNotEmpty()
    idCardNumber: number;

    @IsString()
    @IsNotEmpty()
    password: string;
}
