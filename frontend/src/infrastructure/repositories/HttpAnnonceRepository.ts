import { apiClient } from '../http/apiClient';
import type { Annonce, AnnoncePayload } from '../../domain/entities/Annonce';
import type { AnnonceRepository } from '../../domain/repositories/AnnonceRepository';

export class HttpAnnonceRepository implements AnnonceRepository {
  async list(): Promise<Annonce[]> {
    const { data } = await apiClient.get<Annonce[]>('/annonces');
    return data;
  }

  async getById(id: string): Promise<Annonce> {
    const { data } = await apiClient.get<Annonce>(`/annonces/${id}`);
    return data;
  }

  async create(payload: AnnoncePayload): Promise<Annonce> {
    const { data } = await apiClient.post<Annonce>('/annonces', payload);
    return data;
  }

  async update(id: string, payload: Partial<AnnoncePayload>): Promise<Annonce> {
    const { data } = await apiClient.patch<Annonce>(`/annonces/${id}`, payload);
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/annonces/${id}`);
  }
}
