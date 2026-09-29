import { Repository } from 'typeorm';
import { Etudiant } from './domain/etudiant.entity';
import { CreateEtudiantDto } from './dto/create-etudiant.dto';
import { User } from '../user/domain/user.entity.js';
export declare class EtudiantService {
    private readonly etudiantRepository;
    private readonly userRepository;
    constructor(etudiantRepository: Repository<Etudiant>, userRepository: Repository<User>);
    create(createEtudiantDto: CreateEtudiantDto): Promise<Etudiant>;
    findAll(): Promise<Etudiant[]>;
    findOne(id: string): Promise<Etudiant>;
    findMe(userId: string): Promise<Etudiant>;
}
