import type { Presence, PresenceStatut } from '../entities/Presence';

export interface CreatePresenceData {
  date: string;
  statut: PresenceStatut;
  justification?: string;
  etudiantId: string;
}

export type UpdatePresenceData = Partial<CreatePresenceData>;

export interface PresenceRepository {
  list(): Promise<Presence[]>;
  create(data: CreatePresenceData): Promise<Presence>;
  update(id: string, data: UpdatePresenceData): Promise<Presence>;
  delete(id: string): Promise<void>;
}