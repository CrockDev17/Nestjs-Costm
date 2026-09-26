import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etudiant } from './domain/etudiant.entity';
import { CreateEtudiantDto } from './dto/create-etudiant.dto';

@Injectable()
export class EtudiantService {
  constructor(
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
  ) {}

  async create(createEtudiantDto: CreateEtudiantDto): Promise<Etudiant> {
    const etudiant = this.etudiantRepository.create(createEtudiantDto);
    return await this.etudiantRepository.save(etudiant);
  }

  async findAll(): Promise<Etudiant[]> {
    return await this.etudiantRepository.find({ relations: { presences: true, } });
  }

  async findOne(id: string): Promise<Etudiant> {
    const etudiant = await this.etudiantRepository.findOne({
      where: { id },
      relations: { presences: true },
    });

    if (!etudiant) {
      throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
    }

    return etudiant;
  }
}