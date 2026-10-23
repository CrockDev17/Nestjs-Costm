import type { PresenceRepository } from '../../domain/repositories/PresenceRepository';

export class DeletePresenceUseCase {
  private readonly presenceRepository: PresenceRepository;

  constructor(presenceRepository: PresenceRepository) {
    this.presenceRepository = presenceRepository;
  }

  execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Identifiant de présence manquant.');
    }

    return this.presenceRepository.delete(id);
  }
}