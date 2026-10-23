import type { Note } from '../entities/Note';

export interface CreateNoteData {
  valeur: number;
  matiere: string;
  semestre?: string;
  etudiantId: string;
}

export type UpdateNoteData = Partial<CreateNoteData>;

export interface NoteRepository {
  list(): Promise<Note[]>;
  create(data: CreateNoteData): Promise<Note>;
  update(id: string, data: UpdateNoteData): Promise<Note>;
  delete(id: string): Promise<void>;
}
