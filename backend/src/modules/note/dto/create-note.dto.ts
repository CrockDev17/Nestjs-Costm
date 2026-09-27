import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateNoteDto {
  @IsNumber()
  @Min(0)
  @Max(20)
  valeur: number;

  @IsString()
  @IsNotEmpty()
  matiere: string;

  @IsString()
  @IsOptional()
  semestre?: string;

  @IsUUID()
  @IsNotEmpty()
  etudiantId: string;
}