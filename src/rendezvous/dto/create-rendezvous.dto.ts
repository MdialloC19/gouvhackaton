import { IsString, IsDate, IsOptional, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRendezvousDto {
    @IsString()
    readonly citoyen?: Types.ObjectId;

    @IsString()
    readonly institution?: Types.ObjectId;

    @IsDate()
    readonly dateAndHour: Date;

    @IsOptional()
    @IsNumber()
    readonly duration?: number;

    @IsOptional()
    @IsString()
    readonly state?: string;

    @IsOptional()
    @IsString()
    readonly priority?: string;

    @IsOptional()
    @IsString()
    readonly type?: string;

    @IsOptional()
    @IsString()
    readonly comment?: string;
}
