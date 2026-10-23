import type { Presence } from '../../domain/entities/Presence';
import type {
  UpdatePresenceData,
  PresenceRepository,
} from '../../domain/repositories/PresenceRepository';

export class UpdatePresenceUseCase {
  private readonly presenceRepository: PresenceRepository;

  constructor(presenceRepository: PresenceRepository) {
    this.presenceRepository = presenceRepository;
  }

  execute(id: string, data: UpdatePresenceData): Promise<Presence> {
    if (!id) {
      throw new Error('Identifiant de présence manquant.');
    }

    if (data.date !== undefined && (!data.date || Number.isNaN(Date.parse(data.date)))) {
      throw new Error('Veuillez saisir une date valide.');
    }

    if (
      data.statut !== undefined &&
      !['PRESENT', 'ABSENT', 'RETARD', 'EXCUSE'].includes(data.statut)
    ) {
      throw new Error('Le statut de présence est invalide.');
    }

    return this.presenceRepository.update(id, {
      ...data,
      justification: data.justification?.trim() ?? data.justification,
    });
  }
}