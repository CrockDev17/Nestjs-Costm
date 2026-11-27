import {
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class UpdateProgrammeDto {
    @IsOptional()
    @IsString()
    @MaxLength(20)
    code?: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    nom?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    niveau?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}