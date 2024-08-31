import { IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFonctionnaireDto {
  @IsString()
  @IsNotEmpty()
  readonly idNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly role: string;

  @IsString()
  @IsNotEmpty()
  readonly institutionName: string; 
  
  
}
