import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Etudiant } from './domain/etudiant.entity.js';
import { CreateEtudiantDto } from './dto/create-etudiant.dto.js';
import { UpdateEtudiantDto } from './dto/update-etudiant.dto.js';
import { User } from '../user/domain/user.entity.js';
import { Programme } from '../programme/domain/programme.entity.js';

@Injectable()
export class EtudiantService {
  constructor(
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Programme)
    private readonly programmeRepository: Repository<Programme>,
  ) {}

  async create(
    createEtudiantDto: CreateEtudiantDto,
  ): Promise<Etudiant> {
    const { programmeId, ...donneesEtudiant } = createEtudiantDto;

    const programme = await this.programmeRepository.findOne({
      where: { id: programmeId },
    });

    if (!programme) {
      throw new NotFoundException('Programme introuvable');
    }

    const etudiant = this.etudiantRepository.create({
      ...donneesEtudiant,
      programme,
    });

    return await this.etudiantRepository.save(etudiant);
  }

  async findAll(): Promise<Etudiant[]> {
    return await this.etudiantRepository.find({
      relations: {
        programme: true,
        presences: true,
        notes: true,
        paiements: true,
        diplomes: true,
      },
    });
  }

  async findOne(id: string): Promise<Etudiant> {
    const etudiant = await this.etudiantRepository.findOne({
      where: { id },
      relations: {
        programme: true,
        presences: true,
        notes: true,
        paiements: true,
        diplomes: true,
      },
    });

    if (!etudiant) {
      throw new NotFoundException(
        `Étudiant avec l'ID ${id} non trouvé`,
      );
    }

    return etudiant;
  }

  async findMe(userId: string): Promise<Etudiant> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        etudiant: {
          programme: true,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (!user.etudiant) {
      throw new NotFoundException(
        'Aucun étudiant associé à cet utilisateur',
      );
    }

    return user.etudiant;
  }

  async update(
    id: string,
    updateEtudiantDto: UpdateEtudiantDto,
  ): Promise<Etudiant> {
    const etudiant = await this.etudiantRepository.findOne({
      where: { id },
      relations: {
        programme: true,
      },
    });

    if (!etudiant) {
      throw new NotFoundException(
        `Étudiant avec l'ID ${id} non trouvé`,
      );
    }

    const { programmeId, ...donneesEtudiant } = updateEtudiantDto;

    Object.assign(etudiant, donneesEtudiant);

    if (programmeId) {
      const programme = await this.programmeRepository.findOne({
        where: { id: programmeId },
      });

      if (!programme) {
        throw new NotFoundException('Programme introuvable');
      }

      etudiant.programme = programme;
    }

    await this.etudiantRepository.save(etudiant);

    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const etudiant = await this.findOne(id);

    const hasLinkedRecords =
      etudiant.presences.length > 0 ||
      etudiant.notes.length > 0 ||
      etudiant.paiements.length > 0 ||
      etudiant.diplomes.length > 0;

    if (hasLinkedRecords) {
      throw new ConflictException(
        'Suppression impossible : cet étudiant possède des notes, présences, paiements ou diplômes. Conservez son historique.',
      );
    }

    await this.etudiantRepository.remove(etudiant);

    return {
      message: 'Étudiant supprimé avec succès',
    };
  }
}
