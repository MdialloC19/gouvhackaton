import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyOtpDto {
    @IsString()
    @IsNotEmpty()
    otp: string;

    @IsNumber()
    @IsNotEmpty()
    idCardNumber: number;
}
