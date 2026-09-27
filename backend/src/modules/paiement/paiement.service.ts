import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paiement } from './domain/paiement.entity.js';
import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { CreatePaiementDto } from './dto/create-paiement.dto.js';

@Injectable()
export class PaiementService {
  constructor(
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,

    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
  ) {}

  async create(
    createPaiementDto: CreatePaiementDto,
  ): Promise<Paiement> {
    const { etudiantId, ...paiementData } = createPaiementDto;

    const etudiant = await this.etudiantRepository.findOne({
      where: { id: etudiantId },
    });

    if (!etudiant) {
      throw new NotFoundException(
        'Étudiant introuvable pour ce paiement',
      );
    }

    const paiement = this.paiementRepository.create({
      ...paiementData,
      etudiant,
    });

    return await this.paiementRepository.save(paiement);
  }

  async findAll(): Promise<Paiement[]> {
    return await this.paiementRepository.find({
      relations: {
        etudiant: true,
      },
    });
  }

  async findOne(id: string): Promise<Paiement> {
    const paiement = await this.paiementRepository.findOne({
      where: { id },
      relations: {
        etudiant: true,
      },
    });

    if (!paiement) {
      throw new NotFoundException(
        `Paiement avec l'ID ${id} non trouvé`,
      );
    }

    return paiement;
  }
}