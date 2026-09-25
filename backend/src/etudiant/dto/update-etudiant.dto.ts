import { PartialType } from '@nestjs/mapped-types';
import { CreateEtudiantDto } from './create-etudiant.dto.js';

export class UpdateEtudiantDto extends PartialType(CreateEtudiantDto) {}
