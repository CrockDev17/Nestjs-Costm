import {
  IsIn,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

import {
  AnnonceStatut,
  AnnonceType,
} from '../domain/annonce.entity.js';

export class UpdateAnnonceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  contenu?: string;

  @IsOptional()
  @IsIn(Object.values(AnnonceType))
  type?: AnnonceType;

  @IsOptional()
  @IsDateString()
  dateEvenement?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  lieu?: string | null;

  @IsOptional()
  @IsDateString()
  dateExpiration?: string | null;

  @IsOptional()
  @IsIn(Object.values(AnnonceStatut))
  statut?: AnnonceStatut;
}
