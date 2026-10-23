import type { Etudiant } from '../../domain/entities/Etudiant';
import type { EtudiantRepository } from '../../domain/repositories/EtudiantRepository';

export class ListEtudiantsUseCase {
  private readonly repository: EtudiantRepository;

  constructor(repository: EtudiantRepository) {
    this.repository = repository;
  }

  execute(): Promise<Etudiant[]> {
    return this.repository.list();
  }
}