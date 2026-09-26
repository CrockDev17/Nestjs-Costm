import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Programme } from './domain/programme.entity';
import { CreateProgrammeDto } from './dto/create-programme.dto';

@Injectable()
export class ProgrammeService {
  constructor(
    @InjectRepository(Programme)
    private readonly programmeRepository: Repository<Programme>,
  ) {}

  async create(
    createProgrammeDto: CreateProgrammeDto,
  ): Promise<Programme> {
    const programme = this.programmeRepository.create(
      createProgrammeDto,
    );

    return await this.programmeRepository.save(programme);
  }

  async findAll(): Promise<Programme[]> {
    return await this.programmeRepository.find({
      relations: {
        etudiants: true,
      },
    });
  }

  async findOne(id: string): Promise<Programme> {
    const programme = await this.programmeRepository.findOne({
      where: { id },
      relations: {
        etudiants: true,
      },
    });

    if (!programme) {
      throw new NotFoundException(
        `Programme avec l'ID ${id} non trouvé`,
      );
    }

    return programme;
  }
}