import type { Paiement, PaiementStatut } from '../entities/Paiement';

export interface CreatePaiementData {
  montant: number;
  date: string;
  motif: string;
  statut: PaiementStatut;
  reference: string;
  etudiantId: string;
}

export type UpdatePaiementData = Partial<CreatePaiementData>;

export interface PaiementRepository {
  list(): Promise<Paiement[]>;
  create(data: CreatePaiementData): Promise<Paiement>;
  update(id: string, data: UpdatePaiementData): Promise<Paiement>;
  delete(id: string): Promise<void>;
}
