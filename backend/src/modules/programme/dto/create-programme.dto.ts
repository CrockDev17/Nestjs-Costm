import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProgrammeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)

  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nom: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  niveau: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}