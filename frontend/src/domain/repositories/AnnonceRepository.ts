import type { Annonce, AnnoncePayload } from '../entities/Annonce';

export interface AnnonceRepository {
  list(): Promise<Annonce[]>;
  getById(id: string): Promise<Annonce>;
  create(data: AnnoncePayload): Promise<Annonce>;
  update(id: string, data: Partial<AnnoncePayload>): Promise<Annonce>;
  delete(id: string): Promise<void>;
}
