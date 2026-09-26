import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { StatutPresence } from '../presence.entity';

export class CreatePresenceDto {
  @IsEnum(StatutPresence)
  @IsNotEmpty()
  statut: StatutPresence;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  justification?: string;

  @IsUUID()
  @IsNotEmpty()
  etudiantId: string;
}