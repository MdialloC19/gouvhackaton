import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInstitutionDto {
    @ApiProperty({
        description: 'Nom de l\'institution',
        example: 'Université Polytechnique',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Département de l\'institution',
        example: 'Informatique',
    })
    @IsString()
    @IsNotEmpty()
    department: string;

    @ApiProperty({
        description: 'Domaine d\'expertise de l\'institution',
        example: 'Éducation',
    })
    @IsString()
    @IsNotEmpty()
    domain: string;

    @ApiProperty({
        description: 'Localité de l\'institution',
        example: 'Dakar',
    })
    @IsString()
    @IsNotEmpty()
    locality: string;
}
