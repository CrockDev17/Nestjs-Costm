import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { TypeDiplome } from '../domain/diplome.entity.js';

export class CreateDiplomeDto {
  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsEnum(TypeDiplome)
  @IsNotEmpty()
  type: TypeDiplome;

  @IsDateString()
  @IsNotEmpty()
  dateObtention: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsOptional()
  mention?: string;

  @IsUUID()
  @IsNotEmpty()
  etudiantId: string;
}