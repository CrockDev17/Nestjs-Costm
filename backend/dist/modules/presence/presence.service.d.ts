import { Repository } from 'typeorm';
import { Presence } from './presence.entity.js';
import { CreatePresenceDto } from './dto/create-presence.dto.js';
import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
export declare class PresenceService {
    private readonly presenceRepository;
    private readonly etudiantRepository;
    constructor(presenceRepository: Repository<Presence>, etudiantRepository: Repository<Etudiant>);
    create(createPresenceDto: CreatePresenceDto): Promise<Presence>;
    findAll(): Promise<Presence[]>;
}
