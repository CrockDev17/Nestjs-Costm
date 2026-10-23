import { apiClient } from '../http/apiClient';
import type { Programme } from '../../domain/entities/Programme';
import type { ProgrammeRepository } from '../../domain/repositories/ProgrammeRepository';

export class HttpProgrammeRepository implements ProgrammeRepository {
  async list(): Promise<Programme[]> {
    const { data } = await apiClient.get<Programme[]>('/programmes');
    return data;
  }

  async getById(id: string): Promise<Programme> {
    const { data } = await apiClient.get<Programme>(`/programmes/${id}`);
    return data;
  }

  async create(payload: {
    code: string;
    nom: string;
    niveau: string;
    description?: string;
  }): Promise<Programme> {
    const { data } = await apiClient.post<Programme>('/programmes', payload);
    return data;
  }

  async update(
    id: string,
    payload: Partial<Omit<Programme, 'id'>>,
  ): Promise<Programme> {
    const { data } = await apiClient.patch<Programme>(
      `/programmes/${id}`,
      payload,
    );
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/programmes/${id}`);
  }
}