import { IsString, IsDate, IsOptional, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRendezvousDto {
    @IsString()
    readonly citoyen?: Types.ObjectId[]; // ID du citoyen

    @IsString()
    readonly institution?: Types.ObjectId[]; // ID de l'institution

    @IsDate()
    readonly dateAndHour: Date;

    @IsOptional()
    @IsNumber()
    readonly duration?: number; // Durée en minutes

    @IsOptional()
    @IsString()
    readonly state?: string; // Etat du rendez-vous

    @IsOptional()
    @IsString()
    readonly priority?: string; // Priorité du rendez-vous

    @IsOptional()
    @IsString()
    readonly type?: string; // Type de rendez-vous

    @IsOptional()
    @IsString()
    readonly comment?: string;
}
