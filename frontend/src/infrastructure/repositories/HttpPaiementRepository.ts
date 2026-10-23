import { apiClient } from '../http/apiClient';
import type { Paiement } from '../../domain/entities/Paiement';
import type {
  CreatePaiementData,
  PaiementRepository,
} from '../../domain/repositories/PaiementRepository';

export class HttpPaiementRepository implements PaiementRepository {
  async list(): Promise<Paiement[]> {
    const { data } = await apiClient.get<Paiement[]>('/paiements');
    return data;
  }

  async create(payload: CreatePaiementData): Promise<Paiement> {
    const { data } = await apiClient.post<Paiement>('/paiements', payload);
    return data;
  }
}