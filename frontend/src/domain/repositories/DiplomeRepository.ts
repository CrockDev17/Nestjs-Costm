import type {
  Diplome,
  DiplomaVerification,
  CreateDiplomeInput,
} from '../entities/Diplome';

export interface DiplomeRepository {
  list(): Promise<Diplome[]>;
  create(input: CreateDiplomeInput): Promise<Diplome>;
  verify(reference: string): Promise<DiplomaVerification>;
}
