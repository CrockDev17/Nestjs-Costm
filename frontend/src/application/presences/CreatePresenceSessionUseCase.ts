import type { PresenceSessionRepository } from '../../domain/repositories/PresenceSessionRepository';

export class CreatePresenceSessionUseCase {
  private readonly repository: PresenceSessionRepository;

  constructor(repository: PresenceSessionRepository) {
    this.repository = repository;
  }

  execute(cours: string) {
    return this.repository.create(cours);
  }
}
