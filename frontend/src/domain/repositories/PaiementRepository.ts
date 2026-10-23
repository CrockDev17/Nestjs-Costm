import type { Paiement, PaiementStatut } from '../entities/Paiement';

export interface CreatePaiementData {
  montant: number;
  date: string;
  motif: string;
  statut: PaiementStatut;
  reference: string;
  etudiantId: string;
}

export interface PaiementRepository {
  list(): Promise<Paiement[]>;
  create(data: CreatePaiementData): Promise<Paiement>;
}