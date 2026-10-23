import type { PresenceSessionRepository } from '../../domain/repositories/PresenceSessionRepository';

export class ListPresenceSessionsUseCase {
  private readonly repository: PresenceSessionRepository;

  constructor(repository: PresenceSessionRepository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.list();
  }
}
