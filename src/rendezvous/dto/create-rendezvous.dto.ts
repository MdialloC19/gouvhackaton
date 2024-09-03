import { IsNotEmpty, IsString, IsEnum, IsDateString, IsNumber } from 'class-validator';

export class CreateRendezvousDto {
  @IsNotEmpty()
  @IsString()
  readonly citoyen: string;

  @IsNotEmpty()
  @IsString()
  readonly institution: string;

  @IsNotEmpty()
  @IsDateString()
  readonly dateAndHour: string;

  @IsNotEmpty()
  @IsNumber()
  readonly duration: number;

  @IsNotEmpty()
  @IsEnum(['pending', 'confirmed', 'cancelled'])
  readonly state: string;

  @IsNotEmpty()
  @IsEnum(['low', 'medium', 'high'])
  readonly priority: string;

  @IsNotEmpty()
  @IsEnum(['initial', 'follow-up'])
  readonly type: string;

  @IsNotEmpty()
  @IsString()
  readonly comment: string;
}
