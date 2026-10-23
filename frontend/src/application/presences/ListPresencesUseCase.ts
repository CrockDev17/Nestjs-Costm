import type { Presence } from '../../domain/entities/Presence';
import type { PresenceRepository } from '../../domain/repositories/PresenceRepository';

export class ListPresencesUseCase {
  private readonly presenceRepository: PresenceRepository;

  constructor(presenceRepository: PresenceRepository) {
    this.presenceRepository = presenceRepository;
  }

  execute(): Promise<Presence[]> {
    return this.presenceRepository.list();
  }
}