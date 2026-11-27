import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';

import { Presence, StatutPresence } from './presence.entity.js';
import { PresenceSession } from './presence-session.entity.js';
import { CreatePresenceDto } from './dto/create-presence.dto.js';
import { UpdatePresenceDto } from './dto/update-presence.dto.js';
import { CreatePresenceSessionDto } from './dto/create-presence-session.dto.js';
import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { User, UserRole } from '../user/domain/user.entity.js';

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence)
    private readonly presenceRepository: Repository<Presence>,
    @InjectRepository(PresenceSession)
    private readonly sessionRepository: Repository<PresenceSession>,
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Présences manuelles existantes
  async create(dto: CreatePresenceDto): Promise<Presence> {
    const { etudiantId, ...presenceData } = dto;
    const etudiant = await this.etudiantRepository.findOne({
      where: { id: etudiantId },
    });

    if (!etudiant) {
      throw new NotFoundException('Étudiant introuvable pour cette présence.');
    }

    const presence = this.presenceRepository.create({
      ...presenceData,
      justification: presenceData.justification?.trim() || null,
      etudiant,
      session: null,
    });

    return this.presenceRepository.save(presence);
  }

  async findAll(): Promise<Presence[]> {
    return this.presenceRepository.find({
      relations: { etudiant: true, session: true },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Presence> {
    const presence = await this.presenceRepository.findOne({
      where: { id },
      relations: { etudiant: true, session: true },
    });

    if (!presence) {
      throw new NotFoundException(`Présence avec l'ID ${id} non trouvée.`);
    }

    return presence;
  }

  async update(id: string, dto: UpdatePresenceDto): Promise<Presence> {
    const presence = await this.findOne(id);

    if (dto.etudiantId !== undefined) {
      const etudiant = await this.etudiantRepository.findOne({
        where: { id: dto.etudiantId },
      });

      if (!etudiant) {
        throw new NotFoundException('Étudiant introuvable pour cette présence.');
      }
      presence.etudiant = etudiant;
    }

    if (dto.statut !== undefined) presence.statut = dto.statut;
    if (dto.date !== undefined) presence.date = dto.date;
    if (dto.justification !== undefined) {
      presence.justification = dto.justification.trim() || null;
    }

    await this.presenceRepository.save(presence);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const presence = await this.findOne(id);
    await this.presenceRepository.remove(presence);
    return { message: 'Présence supprimée avec succès.' };
  }

  async findMyPresences(userId: string): Promise<Presence[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { etudiant: true },
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    if (!user.etudiant) {
      throw new NotFoundException('Aucun étudiant associé à cet utilisateur.');
    }

    return this.presenceRepository.find({
      where: { etudiant: { id: user.etudiant.id } },
      relations: { etudiant: true, session: true },
      order: { date: 'DESC' },
    });
  }

  // Créer un QR utilisable pendant 5 minutes
  async createSession(
    dto: CreatePresenceSessionDto,
    adminId: string,
  ): Promise<PresenceSession> {
    const cours = dto.cours.trim();
    if (!cours) throw new BadRequestException('Le nom du cours est obligatoire.');

    const session = this.sessionRepository.create({
      cours,
      token: randomUUID(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      closedAt: null,
      createdBy: adminId,
    });

    return this.sessionRepository.save(session);
  }

  async listSessions(): Promise<PresenceSession[]> {
    return this.sessionRepository.find({
      relations: { presences: { etudiant: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async getSession(id: string): Promise<PresenceSession> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: { presences: { etudiant: true } },
    });

    if (!session) throw new NotFoundException('Session de pointage introuvable.');
    return session;
  }

  async closeSession(id: string): Promise<PresenceSession> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) throw new NotFoundException('Session de pointage introuvable.');

    if (!session.closedAt) {
      session.closedAt = new Date();
      await this.sessionRepository.save(session);
    }

    return this.getSession(id);
  }

  // Le compte connecté détermine l'étudiant : aucun etudiantId reçu du navigateur.
  async scanSession(token: string, userId: string): Promise<Presence> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { etudiant: true },
    });

    if (!user) throw new NotFoundException('Compte introuvable.');
    if (user.role !== UserRole.ETUDIANT || !user.etudiant) {
      throw new ForbiddenException('Le pointage QR est réservé aux comptes étudiants.');
    }

    const session = await this.sessionRepository.findOne({ where: { token } });
    if (!session) throw new NotFoundException('QR code invalide ou inconnu.');
    if (session.closedAt) {
      throw new ConflictException('Cette session de pointage est fermée.');
    }
    if (Date.now() >= session.expiresAt.getTime()) {
      throw new ConflictException('Ce QR code a expiré. Demandez un nouveau code à l’administration.');
    }

    const existing = await this.presenceRepository.findOne({
      where: {
        session: { id: session.id },
        etudiant: { id: user.etudiant.id },
      },
      relations: { etudiant: true, session: true },
    });

    if (existing) {
      throw new ConflictException('Votre présence est déjà enregistrée pour ce cours.');
    }

    const date = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Indian/Antananarivo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    const presence = this.presenceRepository.create({
      statut: StatutPresence.PRESENT,
      date,
      justification: null,
      etudiant: user.etudiant,
      session,
    });

    try {
      return await this.presenceRepository.save(presence);
    } catch {
      // Protège aussi contre deux scans simultanés du même étudiant.
      throw new ConflictException('Votre présence est déjà enregistrée pour ce cours.');
    }
  }
}
