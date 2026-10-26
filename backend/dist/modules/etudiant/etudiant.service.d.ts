import { Repository } from 'typeorm';
import { Etudiant } from './domain/etudiant.entity.js';
import { CreateEtudiantDto } from './dto/create-etudiant.dto.js';
import { UpdateEtudiantDto } from './dto/update-etudiant.dto.js';
import { User } from '../user/domain/user.entity.js';
export declare class EtudiantService {
    private readonly etudiantRepository;
    private readonly userRepository;
    constructor(etudiantRepository: Repository<Etudiant>, userRepository: Repository<User>);
    create(createEtudiantDto: CreateEtudiantDto): Promise<Etudiant>;
    findAll(): Promise<Etudiant[]>;
    findOne(id: string): Promise<Etudiant>;
    findMe(userId: string): Promise<Etudiant>;
    update(id: string, updateEtudiantDto: UpdateEtudiantDto): Promise<Etudiant>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
