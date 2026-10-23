import type { PresenceSessionRepository } from '../../domain/repositories/PresenceSessionRepository';

export class ScanPresenceSessionUseCase {
  private readonly repository: PresenceSessionRepository;

  constructor(repository: PresenceSessionRepository) {
    this.repository = repository;
  }

  execute(token: string) {
    return this.repository.scan(token);
  }
}
