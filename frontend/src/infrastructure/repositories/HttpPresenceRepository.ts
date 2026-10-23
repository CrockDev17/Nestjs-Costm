import { apiClient } from '../http/apiClient';
import type { Presence } from '../../domain/entities/Presence';
import type {
  CreatePresenceData,
  UpdatePresenceData,
  PresenceRepository,
} from '../../domain/repositories/PresenceRepository';

export class HttpPresenceRepository implements PresenceRepository {
  async list(): Promise<Presence[]> {
    const { data } = await apiClient.get<Presence[]>('/presences');
    return data;
  }

  async create(payload: CreatePresenceData): Promise<Presence> {
    const { data } = await apiClient.post<Presence>('/presences', payload);
    return data;
  }

  async update(id: string, payload: UpdatePresenceData): Promise<Presence> {
    const { data } = await apiClient.patch<Presence>(`/presences/${id}`, payload);
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/presences/${id}`);
  }
}