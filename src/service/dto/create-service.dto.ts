import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { EnumFieldType } from '../field.schema';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  documentName: string;

  @IsNumber()
  @IsOptional()
  fees?: number;

  @IsString()
  @IsNotEmpty()
  processingTime: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsArray()
  @IsOptional()
  institutions?: Types.ObjectId[];

  @IsArray()
  @IsOptional()
  fields?: Types.ObjectId[];
}
