import type { Annonce, AnnoncePayload } from '../../domain/entities/Annonce';
import type { AnnonceRepository } from '../../domain/repositories/AnnonceRepository';

export class CreateAnnonceUseCase {
  private readonly repository: AnnonceRepository;

  constructor(repository: AnnonceRepository) {
    this.repository = repository;
  }

  execute(data: AnnoncePayload): Promise<Annonce> {
    return this.repository.create(data);
  }
}
