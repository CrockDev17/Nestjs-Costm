export interface Note {
  id: string;
  valeur: number;
  matiere: string;
  semestre?: string | null;
  etudiantId?: string;
  etudiant?: {
    id: string;
    matricule?: string;
    nom?: string;
    prenom?: string;
    email?: string;
  } | null;
}