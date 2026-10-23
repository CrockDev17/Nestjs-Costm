import type { AnnonceRepository } from '../../domain/repositories/AnnonceRepository';

export class DeleteAnnonceUseCase {
  private readonly repository: AnnonceRepository;

  constructor(repository: AnnonceRepository) {
    this.repository = repository;
  }

  execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
