import type { NoteRepository } from '../../domain/repositories/NoteRepository';

export class DeleteNoteUseCase {
  private readonly noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    this.noteRepository = noteRepository;
  }

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Identifiant de la note manquant.');
    }

    return this.noteRepository.delete(id);
  }
}