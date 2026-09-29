import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Presence } from './presence.entity';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { Etudiant } from '../etudiant/domain/etudiant.entity';
import { User } from '../user/domain/user.entity';

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence)
    private readonly presenceRepository: Repository<Presence>,

    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ==========================================
  // CRÉER UNE PRÉSENCE
  // ==========================================

  async create(
    createPresenceDto: CreatePresenceDto,
  ): Promise<Presence> {
    const {
      etudiantId,
      ...presenceData
    } = createPresenceDto;

    const etudiant =
      await this.etudiantRepository.findOne({
        where: {
          id: etudiantId,
        },
      });

    if (!etudiant) {
      throw new NotFoundException(
        'Étudiant introuvable pour la présence',
      );
    }

    const presence =
      this.presenceRepository.create({
        ...presenceData,
        etudiant,
      });

    return await this.presenceRepository.save(
      presence,
    );
  }

  // ==========================================
  // TOUTES LES PRÉSENCES
  // ==========================================

  async findAll(): Promise<Presence[]> {
    return await this.presenceRepository.find({
      relations: {
        etudiant: true,
      },
    });
  }

  // ==========================================
  // UNE PRÉSENCE PAR ID
  // ADMIN
  // ==========================================

  async findOne(
    id: string,
  ): Promise<Presence> {
    const presence =
      await this.presenceRepository.findOne({
        where: {
          id,
        },
        relations: {
          etudiant: true,
        },
      });

    if (!presence) {
      throw new NotFoundException(
        `Présence avec l'ID ${id} non trouvée`,
      );
    }

    return presence;
  }

  // ==========================================
  // PRÉSENCES DE L'ÉTUDIANT CONNECTÉ
  // ==========================================

  async findMyPresences(
    userId: string,
  ): Promise<Presence[]> {
    const user =
      await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: {
          etudiant: true,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'Utilisateur introuvable',
      );
    }

    if (!user.etudiant) {
      throw new NotFoundException(
        'Aucun étudiant associé à cet utilisateur',
      );
    }

    return await this.presenceRepository.find({
      where: {
        etudiant: {
          id: user.etudiant.id,
        },
      },
      relations: {
        etudiant: true,
      },
      order: {
        date: 'DESC',
      },
    });
  }
}