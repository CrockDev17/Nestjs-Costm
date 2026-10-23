import type { Note } from '../../domain/entities/Note';
import type {
  NoteRepository,
  UpdateNoteData,
} from '../../domain/repositories/NoteRepository';

export class UpdateNoteUseCase {
  private readonly noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    this.noteRepository = noteRepository;
  }

  async execute(id: string, data: UpdateNoteData): Promise<Note> {
    if (!id) {
      throw new Error('Identifiant de la note manquant.');
    }

    if (data.valeur !== undefined) {
      if (
        !Number.isFinite(data.valeur) ||
        data.valeur < 0 ||
        data.valeur > 20
      ) {
        throw new Error('La note doit être comprise entre 0 et 20.');
      }
    }

    if (data.matiere !== undefined && !data.matiere.trim()) {
      throw new Error('La matière est obligatoire.');
    }

    if (data.etudiantId !== undefined && !data.etudiantId) {
      throw new Error('Veuillez sélectionner un étudiant.');
    }

    return this.noteRepository.update(id, {
      ...data,
      ...(data.matiere !== undefined
        ? { matiere: data.matiere.trim() }
        : {}),
      ...(data.semestre !== undefined
        ? { semestre: data.semestre.trim() || undefined }
        : {}),
    });
  }
}