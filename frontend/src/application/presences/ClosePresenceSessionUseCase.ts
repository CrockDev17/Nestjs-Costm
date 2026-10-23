import type { PresenceSessionRepository } from '../../domain/repositories/PresenceSessionRepository';

export class ClosePresenceSessionUseCase {
  private readonly repository: PresenceSessionRepository;

  constructor(repository: PresenceSessionRepository) {
    this.repository = repository;
  }

  execute(id: string) {
    return this.repository.close(id);
  }
}
