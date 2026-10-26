"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const node_crypto_1 = require("node:crypto");
const presence_entity_js_1 = require("./presence.entity.js");
const presence_session_entity_js_1 = require("./presence-session.entity.js");
const etudiant_entity_js_1 = require("../etudiant/domain/etudiant.entity.js");
const user_entity_js_1 = require("../user/domain/user.entity.js");
let PresenceService = class PresenceService {
    presenceRepository;
    sessionRepository;
    etudiantRepository;
    userRepository;
    constructor(presenceRepository, sessionRepository, etudiantRepository, userRepository) {
        this.presenceRepository = presenceRepository;
        this.sessionRepository = sessionRepository;
        this.etudiantRepository = etudiantRepository;
        this.userRepository = userRepository;
    }
    async create(dto) {
        const { etudiantId, ...presenceData } = dto;
        const etudiant = await this.etudiantRepository.findOne({
            where: { id: etudiantId },
        });
        if (!etudiant) {
            throw new common_1.NotFoundException('Étudiant introuvable pour cette présence.');
        }
        const presence = this.presenceRepository.create({
            ...presenceData,
            justification: presenceData.justification?.trim() || null,
            etudiant,
            session: null,
        });
        return this.presenceRepository.save(presence);
    }
    async findAll() {
        return this.presenceRepository.find({
            relations: { etudiant: true, session: true },
            order: { date: 'DESC' },
        });
    }
    async findOne(id) {
        const presence = await this.presenceRepository.findOne({
            where: { id },
            relations: { etudiant: true, session: true },
        });
        if (!presence) {
            throw new common_1.NotFoundException(`Présence avec l'ID ${id} non trouvée.`);
        }
        return presence;
    }
    async update(id, dto) {
        const presence = await this.findOne(id);
        if (dto.etudiantId !== undefined) {
            const etudiant = await this.etudiantRepository.findOne({
                where: { id: dto.etudiantId },
            });
            if (!etudiant) {
                throw new common_1.NotFoundException('Étudiant introuvable pour cette présence.');
            }
            presence.etudiant = etudiant;
        }
        if (dto.statut !== undefined)
            presence.statut = dto.statut;
        if (dto.date !== undefined)
            presence.date = dto.date;
        if (dto.justification !== undefined) {
            presence.justification = dto.justification.trim() || null;
        }
        await this.presenceRepository.save(presence);
        return this.findOne(id);
    }
    async remove(id) {
        const presence = await this.findOne(id);
        await this.presenceRepository.remove(presence);
        return { message: 'Présence supprimée avec succès.' };
    }
    async findMyPresences(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: { etudiant: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable.');
        if (!user.etudiant) {
            throw new common_1.NotFoundException('Aucun étudiant associé à cet utilisateur.');
        }
        return this.presenceRepository.find({
            where: { etudiant: { id: user.etudiant.id } },
            relations: { etudiant: true, session: true },
            order: { date: 'DESC' },
        });
    }
    async createSession(dto, adminId) {
        const cours = dto.cours.trim();
        if (!cours)
            throw new common_1.BadRequestException('Le nom du cours est obligatoire.');
        const session = this.sessionRepository.create({
            cours,
            token: (0, node_crypto_1.randomUUID)(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            closedAt: null,
            createdBy: adminId,
        });
        return this.sessionRepository.save(session);
    }
    async listSessions() {
        return this.sessionRepository.find({
            relations: { presences: { etudiant: true } },
            order: { createdAt: 'DESC' },
        });
    }
    async getSession(id) {
        const session = await this.sessionRepository.findOne({
            where: { id },
            relations: { presences: { etudiant: true } },
        });
        if (!session)
            throw new common_1.NotFoundException('Session de pointage introuvable.');
        return session;
    }
    async closeSession(id) {
        const session = await this.sessionRepository.findOne({ where: { id } });
        if (!session)
            throw new common_1.NotFoundException('Session de pointage introuvable.');
        if (!session.closedAt) {
            session.closedAt = new Date();
            await this.sessionRepository.save(session);
        }
        return this.getSession(id);
    }
    async scanSession(token, userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: { etudiant: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Compte introuvable.');
        if (user.role !== user_entity_js_1.UserRole.ETUDIANT || !user.etudiant) {
            throw new common_1.ForbiddenException('Le pointage QR est réservé aux comptes étudiants.');
        }
        const session = await this.sessionRepository.findOne({ where: { token } });
        if (!session)
            throw new common_1.NotFoundException('QR code invalide ou inconnu.');
        if (session.closedAt) {
            throw new common_1.ConflictException('Cette session de pointage est fermée.');
        }
        if (Date.now() >= session.expiresAt.getTime()) {
            throw new common_1.ConflictException('Ce QR code a expiré. Demandez un nouveau code à l’administration.');
        }
        const existing = await this.presenceRepository.findOne({
            where: {
                session: { id: session.id },
                etudiant: { id: user.etudiant.id },
            },
            relations: { etudiant: true, session: true },
        });
        if (existing) {
            throw new common_1.ConflictException('Votre présence est déjà enregistrée pour ce cours.');
        }
        const date = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Indian/Antananarivo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());
        const presence = this.presenceRepository.create({
            statut: presence_entity_js_1.StatutPresence.PRESENT,
            date,
            justification: null,
            etudiant: user.etudiant,
            session,
        });
        try {
            return await this.presenceRepository.save(presence);
        }
        catch {
            throw new common_1.ConflictException('Votre présence est déjà enregistrée pour ce cours.');
        }
    }
};
exports.PresenceService = PresenceService;
exports.PresenceService = PresenceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(presence_entity_js_1.Presence)),
    __param(1, (0, typeorm_1.InjectRepository)(presence_session_entity_js_1.PresenceSession)),
    __param(2, (0, typeorm_1.InjectRepository)(etudiant_entity_js_1.Etudiant)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_js_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PresenceService);
//# sourceMappingURL=presence.service.js.map