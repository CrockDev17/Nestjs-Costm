import { Repository } from 'typeorm';
import { Etudiant } from './domain/etudiant.entity.js';
import { CreateEtudiantDto } from './dto/create-etudiant.dto.js';
export declare class EtudiantService {
    private readonly etudiantRepository;
    constructor(etudiantRepository: Repository<Etudiant>);
    create(createEtudiantDto: CreateEtudiantDto): Promise<Etudiant>;
    findAll(): Promise<Etudiant[]>;
    findOne(id: string): Promise<Etudiant>;
}
