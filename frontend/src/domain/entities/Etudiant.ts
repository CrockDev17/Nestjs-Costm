   export interface Etudiant {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  programme?: {
    id: string;
    nom?: string;
  } | null;
}