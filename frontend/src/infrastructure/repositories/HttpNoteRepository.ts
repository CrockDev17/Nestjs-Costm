import { apiClient } from '../http/apiClient';
import type { Note } from '../../domain/entities/Note';
import type {
  CreateNoteData,
  UpdateNoteData,
  NoteRepository,
} from '../../domain/repositories/NoteRepository';

export class HttpNoteRepository implements NoteRepository {
  async list(): Promise<Note[]> {
    const { data } = await apiClient.get<Note[]>('/notes');
    return data;
  }

  async create(payload: CreateNoteData): Promise<Note> {
    const { data } = await apiClient.post<Note>('/notes', payload);
    return data;
  }

  async update(id: string, payload: UpdateNoteData): Promise<Note> {
    const { data } = await apiClient.patch<Note>(
      `/notes/${id}`,
      payload,
    );
    return data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/notes/${id}`);
  }
}
