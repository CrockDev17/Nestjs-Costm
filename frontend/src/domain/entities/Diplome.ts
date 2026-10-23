export interface Diplome {
  id: number;
  reference: string;
  dateObtention?: string;
  etudiant?: {
    id?: number;
    nom?: string;
    prenom?: string;
    matricule?: string;
  };
  programme?: {
    id?: number;
    nom?: string;
  };
}

export interface DiplomaVerification {
  valid: boolean;
  message?: string;
  diplome?: Diplome | null;
}