import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etudiant } from '../entities/etudiant.entity.js';
import { CreateEtudiantDto } from './dto/create-etudiant.dto.js';
import { UpdateEtudiantDto } from './dto/update-etudiant.dto.js';

@Injectable()
export class EtudiantService {
  constructor(
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
  ) {}

  async create(createEtudiantDto: CreateEtudiantDto): Promise<Etudiant> {
    const etudiant = this.etudiantRepository.create(createEtudiantDto);
    return this.etudiantRepository.save(etudiant);
  }

  async findAll(): Promise<Etudiant[]> {
    return this.etudiantRepository.find();
  }

  async findOne(id: string): Promise<Etudiant> {
    const etudiant = await this.etudiantRepository.findOne({ where: { id } });
    if (!etudiant) {
      throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
    }
    return etudiant;
  }

  async update(id: string, updateEtudiantDto: UpdateEtudiantDto): Promise<Etudiant> {
    const etudiant = await this.findOne(id);
    Object.assign(etudiant, updateEtudiantDto);
    return this.etudiantRepository.save(etudiant);
  }

  async remove(id: string): Promise<void> {
    const etudiant = await this.findOne(id);
    await this.etudiantRepository.remove(etudiant);
  }
}