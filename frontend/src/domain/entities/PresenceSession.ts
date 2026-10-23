export interface PresenceSessionStudent {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
}

export interface PresenceSessionRecord {
  id: string;
  date: string;
  statut: string;
  etudiant?: PresenceSessionStudent;
}

export interface PresenceSession {
  id: string;
  cours: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  closedAt: string | null;
  presences?: PresenceSessionRecord[];
}
