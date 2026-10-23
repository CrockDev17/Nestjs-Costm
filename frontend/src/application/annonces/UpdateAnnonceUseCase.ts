import type { Annonce, AnnoncePayload } from '../../domain/entities/Annonce';
import type { AnnonceRepository } from '../../domain/repositories/AnnonceRepository';

export class UpdateAnnonceUseCase {
  private readonly repository: AnnonceRepository;

  constructor(repository: AnnonceRepository) {
    this.repository = repository;
  }

  execute(id: string, data: Partial<AnnoncePayload>): Promise<Annonce> {
    return this.repository.update(id, data);
  }
}
