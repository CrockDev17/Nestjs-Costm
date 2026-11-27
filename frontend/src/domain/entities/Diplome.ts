export interface Diplome {
  id: string;
  numero: string;
  type: 'LICENCE' | 'MASTER' | 'BTS' | 'AUTRE';
  reference: string;
  dateObtention: string;
  mention?: string | null;
  etudiant?: {
    id?: string;
    nom?: string;
    prenom?: string;
    matricule?: string;
    programme?: {
      id?: string;
      nom?: string;
    } | null;
  };
  programme?: {
    id?: string;
    nom?: string;
  } | null;
}

export interface CreateDiplomeInput {
  numero: string;
  type: 'LICENCE' | 'MASTER' | 'BTS' | 'AUTRE';
  dateObtention: string;
  reference: string;
  mention?: string;
  etudiantId: string;
}

export interface DiplomaVerification {
  valid: boolean;
  message?: string;
  diplome?: Diplome | null;
}
