import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { StatutPresence } from '../presence.entity.js';

export class UpdatePresenceDto {
  @IsOptional()
  @IsEnum(StatutPresence)
  statut?: StatutPresence;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  justification?: string;

  @IsOptional()
  @IsUUID()
  etudiantId?: string;
}