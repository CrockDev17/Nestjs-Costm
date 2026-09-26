import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Presence } from './presence.entity';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { Etudiant } from '../etudiant/domain/etudiant.entity';

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence)
    private readonly presenceRepository: Repository<Presence>,

    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
  ) {}

  async create(
    createPresenceDto: CreatePresenceDto,
  ): Promise<Presence> {

    const { etudiantId, ...presenceData } = createPresenceDto;

    const etudiant = await this.etudiantRepository.findOne({
      where: { id: etudiantId },
    });

    if (!etudiant) {
      throw new NotFoundException(
        'Étudiant introuvable pour la présence',
      );
    }

    const presence = this.presenceRepository.create({
      ...presenceData,
      etudiant,
    });

    return await this.presenceRepository.save(presence);
  }

  async findAll(): Promise<Presence[]> {
    return await this.presenceRepository.find({
      relations: {
        etudiant: true,
      },
    });
  }
}