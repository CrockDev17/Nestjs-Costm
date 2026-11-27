import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';

import {
  AnnonceStatut,
  AnnonceType,
} from '../domain/annonce.entity.js';

export class CreateAnnonceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titre: string;

  @IsString()
  @IsNotEmpty()
  contenu: string;

  @IsOptional()
  @IsIn(Object.values(AnnonceType))
  type?: AnnonceType;

  @IsOptional()
  @IsDateString()
  dateEvenement?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  lieu?: string;

  @IsOptional()
  @IsDateString()
  dateExpiration?: string;

  @IsOptional()
  @IsIn(Object.values(AnnonceStatut))
  statut?: AnnonceStatut;
}
