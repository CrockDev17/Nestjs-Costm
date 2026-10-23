export type PresenceStatut = 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSE';

export interface Presence {
  id: string;
  date: string;
  statut: PresenceStatut;
  justification?: string | null;
  etudiantId?: string;
  etudiant?: {
    id: string;
    matricule?: string;
    nom?: string;
    prenom?: string;
  } | null;
}