export type PaiementStatut = 'PAYE' | 'PARTIEL' | 'IMPAYE';

export interface Paiement {
  id: string;
  montant: number;
  date: string;
  motif: string;
  statut: PaiementStatut;
  reference: string;
  etudiantId?: string;
  etudiant?: {
    id: string;
    matricule?: string;
    nom?: string;
    prenom?: string;
  } | null;
}