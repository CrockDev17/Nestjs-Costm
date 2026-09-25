import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Presence } from '../entities/presence.entity.js';
import { Etudiant } from '../entities/etudiant.entity.js';
import { CreatePresenceDto } from './dto/create-presence.dto.js';

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence)
    private readonly presenceRepository: Repository<Presence>,

    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
  ) {}

  async create(createPresenceDto: CreatePresenceDto): Promise<Presence> {
    const etudiant = await this.etudiantRepository.findOne({
      where: { id: createPresenceDto.etudiantId },
    });

    if (!etudiant) {
      throw new NotFoundException(
        `Étudiant avec l'ID ${createPresenceDto.etudiantId} non trouvé`,
      );
    }

    const presence = this.presenceRepository.create({
      date: createPresenceDto.date ?? new Date().toISOString().slice(0, 10),
      statut: createPresenceDto.statut,
      justification: createPresenceDto.justification ?? null,
      etudiant: etudiant,
    });

    return this.presenceRepository.save(presence);
  }

  async findAll(): Promise<Presence[]> {
    return this.presenceRepository.find({
      relations: { etudiant: true },
      order: { date: 'DESC' },
    });
  }

  async findByEtudiant(etudiantId: string): Promise<Presence[]> {
    const etudiant = await this.etudiantRepository.findOne({
      where: { id: etudiantId },
    });

    if (!etudiant) {
      throw new NotFoundException(
        `Étudiant avec l'ID ${etudiantId} non trouvé`,
      );
    }

    return this.presenceRepository.find({
      where: { etudiant: { id: etudiantId } },
      relations: { etudiant: true },
      order: { date: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    const presence = await this.presenceRepository.findOne({
      where: { id },
    });

    if (!presence) {
      throw new NotFoundException(
        `Enregistrement de présence avec l'ID ${id} non trouvé`,
      );
    }

    await this.presenceRepository.remove(presence);
  }
}