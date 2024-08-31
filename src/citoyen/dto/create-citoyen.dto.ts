import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateCitoyenDto {
  @IsString()
  readonly CNI: string;

  @IsString()
  readonly phoneNumber: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly surname: string;

  @IsOptional()
  @IsDate()
  readonly birthday?: Date;

  @IsOptional()
  @IsString()
  readonly job?: string;

  @IsString()
  readonly sex: string; 

  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly fathersName?: string;

  @IsOptional()
  @IsString()
  readonly fathersSurname?: string;

  @IsOptional()
  @IsString()
  readonly mothersName?: string;

  @IsOptional()
  @IsString()
  readonly mothersSurname?: string;

  @IsOptional()
  @IsString()
  readonly maritalStatus?: string;

  
  @IsOptional()
  @IsString()
  readonly address?: string;
}
