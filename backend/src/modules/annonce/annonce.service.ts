import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Annonce } from './domain/annonce.entity.js';
import { CreateAnnonceDto } from './dto/create-annonce.dto.js';
import { UpdateAnnonceDto } from './dto/update-annonce.dto.js';

@Injectable()
export class AnnonceService {
  constructor(
    @InjectRepository(Annonce)
    private readonly annonceRepository: Repository<Annonce>,
  ) {}

  async create(dto: CreateAnnonceDto): Promise<Annonce> {
    const annonce = this.annonceRepository.create({
      titre: dto.titre.trim(),
      contenu: dto.contenu.trim(),
      type: dto.type,
      dateEvenement: dto.dateEvenement
        ? new Date(dto.dateEvenement)
        : null,
      lieu: dto.lieu?.trim() || null,
      dateExpiration: dto.dateExpiration
        ? new Date(dto.dateExpiration)
        : null,
      statut: dto.statut,
    });

    return this.annonceRepository.save(annonce);
  }

  async findAll(): Promise<Annonce[]> {
    return this.annonceRepository.find({
      order: {
        datePublication: 'DESC',
      },
    });
  }

  async findPublished(): Promise<Annonce[]> {
    const annonces = await this.annonceRepository.find({
      where: { statut: 'PUBLIEE' as Annonce['statut'] },
      order: { datePublication: 'DESC' },
    });

    const now = Date.now();
    return annonces.filter((annonce) => {
      if (!annonce.dateExpiration) return true;
      return new Date(annonce.dateExpiration).getTime() >= now;
    });
  }
  async findOne(id: string): Promise<Annonce> {
    const annonce = await this.annonceRepository.findOne({
      where: { id },
    });

    if (!annonce) {
      throw new NotFoundException('Annonce introuvable.');
    }

    return annonce;
  }

  async update(
    id: string,
    dto: UpdateAnnonceDto,
  ): Promise<Annonce> {
    const annonce = await this.findOne(id);

    if (dto.titre !== undefined) {
      annonce.titre = dto.titre.trim();
    }

    if (dto.contenu !== undefined) {
      annonce.contenu = dto.contenu.trim();
    }

    if (dto.type !== undefined) {
      annonce.type = dto.type;
    }

    if (dto.dateEvenement !== undefined) {
      annonce.dateEvenement = dto.dateEvenement
        ? new Date(dto.dateEvenement)
        : null;
    }

    if (dto.lieu !== undefined) {
      annonce.lieu = dto.lieu?.trim() || null;
    }

    if (dto.dateExpiration !== undefined) {
      annonce.dateExpiration = dto.dateExpiration
        ? new Date(dto.dateExpiration)
        : null;
    }

    if (dto.statut !== undefined) {
      annonce.statut = dto.statut;
    }

    return this.annonceRepository.save(annonce);
  }

  async remove(id: string): Promise<{ message: string }> {
    const annonce = await this.findOne(id);

    await this.annonceRepository.remove(annonce);

    return {
      message: 'Annonce supprimée avec succès.',
    };
  }
}
