import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import { StatutPaiement } from '../domain/paiement.entity.js';

export class CreatePaiementDto {
  @IsNumber()
  @Min(0)
  montant: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  motif: string;

  @IsEnum(StatutPaiement)
  @IsNotEmpty()
  statut: StatutPaiement;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsUUID()
  @IsNotEmpty()
  etudiantId: string;
}