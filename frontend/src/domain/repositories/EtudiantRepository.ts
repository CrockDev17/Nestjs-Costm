import type { Etudiant } from '../entities/Etudiant';

export interface EtudiantRepository {
  list(): Promise<Etudiant[]>;
  getById(id: string): Promise<Etudiant>;

  create(data: {
    matricule: string;
    nom: string;
    prenom: string;
    email: string;
  }): Promise<Etudiant>;

  update(
    id: string,
    data: Partial<{
      matricule: string;
      nom: string;
      prenom: string;
      email: string;
    }>
  ): Promise<Etudiant>;

  delete(id: string): Promise<void>;
}
