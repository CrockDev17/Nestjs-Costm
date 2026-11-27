import { apiClient } from '../http/apiClient';
import type { Paiement } from '../../domain/entities/Paiement';
import type {
  CreatePaiementData,
  PaiementRepository,
  UpdatePaiementData,
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

  async update(
    id: string,
    payload: UpdatePaiementData,
  ): Promise<Paiement> {
    const { data } = await apiClient.patch<Paiement>(
      `/paiements/${id}`,
      payload,
    );
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/paiements/${id}`);
  }
}
