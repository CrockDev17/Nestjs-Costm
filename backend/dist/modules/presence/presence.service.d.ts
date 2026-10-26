import { Repository } from 'typeorm';
import { Presence } from './presence.entity.js';
import { PresenceSession } from './presence-session.entity.js';
import { CreatePresenceDto } from './dto/create-presence.dto.js';
import { UpdatePresenceDto } from './dto/update-presence.dto.js';
import { CreatePresenceSessionDto } from './dto/create-presence-session.dto.js';
import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { User } from '../user/domain/user.entity.js';
export declare class PresenceService {
    private readonly presenceRepository;
    private readonly sessionRepository;
    private readonly etudiantRepository;
    private readonly userRepository;
    constructor(presenceRepository: Repository<Presence>, sessionRepository: Repository<PresenceSession>, etudiantRepository: Repository<Etudiant>, userRepository: Repository<User>);
    create(dto: CreatePresenceDto): Promise<Presence>;
    findAll(): Promise<Presence[]>;
    findOne(id: string): Promise<Presence>;
    update(id: string, dto: UpdatePresenceDto): Promise<Presence>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findMyPresences(userId: string): Promise<Presence[]>;
    createSession(dto: CreatePresenceSessionDto, adminId: string): Promise<PresenceSession>;
    listSessions(): Promise<PresenceSession[]>;
    getSession(id: string): Promise<PresenceSession>;
    closeSession(id: string): Promise<PresenceSession>;
    scanSession(token: string, userId: string): Promise<Presence>;
}
