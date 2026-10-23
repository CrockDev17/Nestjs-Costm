import type { Note } from '../../domain/entities/Note';
import type { NoteRepository } from '../../domain/repositories/NoteRepository';

export class ListNotesUseCase {
  private readonly noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    this.noteRepository = noteRepository;
  }

  execute(): Promise<Note[]> {
    return this.noteRepository.list();
  }
}