import type { Presence } from '../../domain/entities/Presence';
import type {
  CreatePresenceData,
  PresenceRepository,
} from '../../domain/repositories/PresenceRepository';

export class CreatePresenceUseCase {
  private readonly presenceRepository: PresenceRepository;

  constructor(presenceRepository: PresenceRepository) {
    this.presenceRepository = presenceRepository;
  }

  execute(data: CreatePresenceData): Promise<Presence> {
    if (!data.etudiantId) {
      throw new Error('Veuillez sélectionner un étudiant.');
    }

    if (!data.date || Number.isNaN(Date.parse(data.date))) {
      throw new Error('Veuillez saisir une date valide.');
    }

    if (!['PRESENT', 'ABSENT', 'RETARD', 'EXCUSE'].includes(data.statut)) {
      throw new Error('Le statut de présence est invalide.');
    }

    return this.presenceRepository.create({
      ...data,
      justification: data.justification?.trim() || undefined,
    });
  }
}