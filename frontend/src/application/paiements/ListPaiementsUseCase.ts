import type { Paiement } from '../../domain/entities/Paiement';
import type { PaiementRepository } from '../../domain/repositories/PaiementRepository';

export class ListPaiementsUseCase {
  private readonly paiementRepository: PaiementRepository;

  constructor(paiementRepository: PaiementRepository) {
    this.paiementRepository = paiementRepository;
  }

  execute(): Promise<Paiement[]> {
    return this.paiementRepository.list();
  }
}