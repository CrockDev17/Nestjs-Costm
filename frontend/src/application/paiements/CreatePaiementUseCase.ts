import type { Paiement } from '../../domain/entities/Paiement';
import type {
  CreatePaiementData,
  PaiementRepository,
} from '../../domain/repositories/PaiementRepository';

export class CreatePaiementUseCase {
  private readonly paiementRepository: PaiementRepository;

  constructor(paiementRepository: PaiementRepository) {
    this.paiementRepository = paiementRepository;
  }

  execute(data: CreatePaiementData): Promise<Paiement> {
    if (!data.etudiantId) {
      throw new Error('Veuillez sélectionner un étudiant.');
    }

    if (!Number.isFinite(data.montant) || data.montant < 0) {
      throw new Error('Le montant doit être positif ou nul.');
    }

    if (!data.date || Number.isNaN(Date.parse(data.date))) {
      throw new Error('Veuillez saisir une date valide.');
    }

    if (!data.motif.trim() || !data.reference.trim()) {
      throw new Error('Le motif et la référence sont obligatoires.');
    }

    return this.paiementRepository.create({
      ...data,
      motif: data.motif.trim(),
      reference: data.reference.trim(),
    });
  }
}