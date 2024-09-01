import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsArray,
    IsMongoId,
    ValidateNested,
} from 'class-validator';
import { CreateDocumentDto } from 'src/document/dto/create-document.dto';
enum RequestState {
    EnCours = 'en-cours',
    Confirme = 'confirmé',
    Termine = 'terminé',
    Rejete = 'rejeté',
}
export class CreateRequestDto {
    @IsNotEmpty()
    @IsMongoId()
    citoyen: string;

    @IsNotEmpty()
    @IsMongoId()
    service: string;

    @IsNotEmpty()
    @IsMongoId()
    institution: string;

    @IsOptional()
    dateAndHour: Date;

    @IsOptional()
    dateAndHourTreatment: Date;

    @IsNotEmpty()
    @IsEnum(RequestState)
    state: RequestState;

    @IsOptional()
    comment: string;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    documents: string[];

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    processedBy: string[];
}
