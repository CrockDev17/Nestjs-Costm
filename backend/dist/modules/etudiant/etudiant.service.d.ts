import { Repository } from 'typeorm';
import { Etudiant } from './domain/etudiant.entity';
import { CreateEtudiantDto } from './dto/create-etudiant.dto';
export declare class EtudiantService {
    private readonly etudiantRepository;
    constructor(etudiantRepository: Repository<Etudiant>);
    create(createEtudiantDto: CreateEtudiantDto): Promise<Etudiant>;
    findAll(): Promise<Etudiant[]>;
    findOne(id: string): Promise<Etudiant>;
}
