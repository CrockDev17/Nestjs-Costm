import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Programme } from './domain/programme.entity.js';
import { CreateProgrammeDto } from './dto/create-programme.dto.js';
import { UpdateProgrammeDto } from './dto/update-programme.dto.js';

@Injectable()
export class ProgrammeService {
  constructor(
    @InjectRepository(Programme)
    private readonly programmeRepository: Repository<Programme>,
  ) { }

  // CRÉER
  async create(dto: CreateProgrammeDto): Promise<Programme> {
    const existing = await this.programmeRepository.findOne({
      where: {
        code: dto.code,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Un programme avec ce code existe déjà',
      );
    }

    const programme = this.programmeRepository.create(dto);

    return await this.programmeRepository.save(programme);
  }

  // LISTE
  async findAll(): Promise<Programme[]> {
    return await this.programmeRepository.find({
      relations: {
        etudiants: true,
      },
      order: {
        code: 'ASC',
      },
    });
  }

  // UN PROGRAMME
  async findOne(id: string): Promise<Programme> {
    const programme = await this.programmeRepository.findOne({
      where: {
        id,
      },
      relations: {
        etudiants: true,
      },
    });

    if (!programme) {
      throw new NotFoundException(
        `Programme avec l'ID ${id} introuvable`,
      );
    }

    return programme;
  }

  // MODIFIER
  async update(
    id: string,
    dto: UpdateProgrammeDto,
  ): Promise<Programme> {
    const programme = await this.findOne(id);

    if (dto.code && dto.code !== programme.code) {
      const existing = await this.programmeRepository.findOne({
        where: {
          code: dto.code,
        },
      });

      if (existing) {
        throw new ConflictException(
          'Un programme avec ce code existe déjà',
        );
      }
    }

    Object.assign(programme, dto);

    return await this.programmeRepository.save(programme);
  }

  // SUPPRIMER
  async remove(id: string): Promise<{ message: string }> {
    const programme = await this.findOne(id);

    await this.programmeRepository.remove(programme);

    return {
      message: 'Programme supprimé avec succès',
    };
  }
}