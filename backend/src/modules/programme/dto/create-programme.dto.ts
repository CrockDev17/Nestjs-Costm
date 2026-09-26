import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProgrammeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  niveau: string;

  @IsString()
  @IsOptional()
  description?: string;
}