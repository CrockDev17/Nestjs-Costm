import type { Diplome, DiplomaVerification } from '../entities/Diplome';

export interface DiplomeRepository {
  list(): Promise<Diplome[]>;
  verify(reference: string): Promise<DiplomaVerification>;
}