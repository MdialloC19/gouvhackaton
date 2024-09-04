import {
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsArray,
    IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

enum RequestState {
    EnCours = 'en-cours',
    Termine = 'terminé',
    Rejete = 'rejeté',
}

export class UpdateRequestDto {
    @IsOptional()
    dateAndHourTreatment: Date;

    @IsNotEmpty()
    @IsEnum(RequestState)
    state: RequestState;

    @IsOptional()
    commentByAgent: string;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    documentsByAgent: string[];

    @IsNotEmpty()
    @IsArray()
    @IsMongoId({ each: true })
    processedBy: string[];
}
