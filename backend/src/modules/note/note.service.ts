import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Note } from './domain/note.entity.js';
import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { CreateNoteDto } from './dto/create-note.dto.js';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,

    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
  ) {}

  async create(
    createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    const { etudiantId, ...noteData } = createNoteDto;

    const etudiant = await this.etudiantRepository.findOne({
      where: { id: etudiantId },
    });

    if (!etudiant) {
      throw new NotFoundException(
        'Étudiant introuvable pour cette note',
      );
    }

    const note = this.noteRepository.create({
      ...noteData,
      etudiant,
    });

    return await this.noteRepository.save(note);
  }

  async findAll(): Promise<Note[]> {
    return await this.noteRepository.find({
      relations: {
        etudiant: true,
      },
    });
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: {
        etudiant: true,
      },
    });

    if (!note) {
      throw new NotFoundException(
        `Note avec l'ID ${id} non trouvée`,
      );
    }

    return note;
  }
}