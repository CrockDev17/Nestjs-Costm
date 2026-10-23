export type AnnonceType =
  | 'INFORMATION'
  | 'EVENEMENT'
  | 'EXAMEN'
  | 'REUNION'
  | 'AUTRE';

export type AnnonceStatut =
  | 'BROUILLON'
  | 'PUBLIEE'
  | 'ARCHIVEE';

export interface Annonce {
  id: string;
  titre: string;
  contenu: string;
  type: AnnonceType;
  dateEvenement: string | null;
  lieu: string | null;
  datePublication: string;
  dateExpiration: string | null;
  statut: AnnonceStatut;
}

export type AnnoncePayload = {
  titre: string;
  contenu: string;
  type: AnnonceType;
  dateEvenement?: string | null;
  lieu?: string | null;
  dateExpiration?: string | null;
  statut: AnnonceStatut;
};
