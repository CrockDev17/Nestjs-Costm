import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/domain/user.entity.js';
import { Note } from './domain/note.entity.js';
import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,

    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
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

    return this.noteRepository.save(note);
  }

  async findAll(): Promise<Note[]> {
    return this.noteRepository.find({
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

  async update(id: string, dto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    const { etudiantId, ...noteData } = dto;

    if (etudiantId !== undefined) {
      const etudiant = await this.etudiantRepository.findOne({
        where: { id: etudiantId },
      });

      if (!etudiant) {
        throw new NotFoundException(
          'Étudiant introuvable pour cette note',
        );
      }

      note.etudiant = etudiant;
    }

    Object.assign(note, noteData);

    await this.noteRepository.save(note);

    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const note = await this.findOne(id);

    await this.noteRepository.remove(note);

    return { message: 'Note supprimée avec succès' };
  }

  async findMyNotes(userId: string): Promise<Note[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        etudiant: true,
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

    return this.noteRepository.find({
      where: {
        etudiant: {
          id: user.etudiant.id,
        },
      },
      relations: {
        etudiant: true,
      },
    });
  }
}
