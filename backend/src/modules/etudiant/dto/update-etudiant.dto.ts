import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class UpdateEtudiantDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  matricule?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nom?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  prenom?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUUID()
  programmeId?: string;
}
