import type { Programme } from '../entities/Programme';

export interface ProgrammeRepository {
  list(): Promise<Programme[]>;
  getById(id: string): Promise<Programme>;
  create(data: {
    code: string;
    nom: string;
    niveau: string;
    description?: string;
  }): Promise<Programme>;
  update(
    id: string,
    data: Partial<Omit<Programme, 'id'>>,
  ): Promise<Programme>;
  delete(id: string): Promise<void>;
}