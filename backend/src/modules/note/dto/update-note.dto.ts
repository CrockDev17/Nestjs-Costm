import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class UpdateNoteDto {
  @IsNumber()
  @Min(0)
  @Max(20)
  @IsOptional()
  valeur?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  matiere?: string;

  @IsString()
  @IsOptional()
  semestre?: string;

  @IsUUID()
  @IsOptional()
  etudiantId?: string;
}
