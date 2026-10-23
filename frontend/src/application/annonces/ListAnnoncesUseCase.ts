import type { Annonce } from '../../domain/entities/Annonce';
import type { AnnonceRepository } from '../../domain/repositories/AnnonceRepository';

export class ListAnnoncesUseCase {
  private readonly repository: AnnonceRepository;

  constructor(repository: AnnonceRepository) {
    this.repository = repository;
  }

  execute(): Promise<Annonce[]> {
    return this.repository.list();
  }
}
