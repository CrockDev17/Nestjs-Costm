import type { Note } from '../../domain/entities/Note';
import type {
  CreateNoteData,
  NoteRepository,
} from '../../domain/repositories/NoteRepository';

export class CreateNoteUseCase {
  private readonly noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    this.noteRepository = noteRepository;
  }

  execute(data: CreateNoteData): Promise<Note> {
    if (!data.matiere.trim()) {
      throw new Error('La matière est obligatoire.');
    }

    if (!Number.isFinite(data.valeur) || data.valeur < 0 || data.valeur > 20) {
      throw new Error('La note doit être comprise entre 0 et 20.');
    }

    if (!data.etudiantId) {
      throw new Error('Veuillez sélectionner un étudiant.');
    }

    return this.noteRepository.create({
      ...data,
      matiere: data.matiere.trim(),
      semestre: data.semestre?.trim() || undefined,
    });
  }
}