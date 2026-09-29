import { Repository } from 'typeorm';
import { Presence } from './presence.entity';
import { CreatePresenceDto } from './dto/create-presence.dto';
import { Etudiant } from '../etudiant/domain/etudiant.entity';
import { User } from '../user/domain/user.entity';
export declare class PresenceService {
    private readonly presenceRepository;
    private readonly etudiantRepository;
    private readonly userRepository;
    constructor(presenceRepository: Repository<Presence>, etudiantRepository: Repository<Etudiant>, userRepository: Repository<User>);
    create(createPresenceDto: CreatePresenceDto): Promise<Presence>;
    findAll(): Promise<Presence[]>;
    findOne(id: string): Promise<Presence>;
    findMyPresences(userId: string): Promise<Presence[]>;
}
