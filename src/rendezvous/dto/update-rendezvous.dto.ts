import { IsString, IsDateString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class UpdateRendezvousDto {
  @IsOptional()
  @IsString()
  readonly citoyen?: string;

  @IsOptional()
  @IsString()
  readonly institution?: string;

  @IsOptional()
  @IsDateString()
  readonly dateAndHour?: string;

  @IsOptional()
  @IsNumber()
  readonly duration?: number;

  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'cancelled'])
  readonly state?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  readonly priority?: string;

  @IsOptional()
  @IsEnum(['initial', 'follow-up'])
  readonly type?: string;

  @IsOptional()
  @IsString()
  readonly comment?: string;
}
