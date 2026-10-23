import type { Programme } from '../../domain/entities/Programme';
import type { ProgrammeRepository } from '../../domain/repositories/ProgrammeRepository';

export class ListProgrammesUseCase {
  private readonly repository: ProgrammeRepository;

  constructor(repository: ProgrammeRepository) {
    this.repository = repository;
  }

  execute(): Promise<Programme[]> {
    return this.repository.list();
  }
}