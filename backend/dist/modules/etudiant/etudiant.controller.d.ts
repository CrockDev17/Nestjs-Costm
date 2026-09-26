import { EtudiantService } from './etudiant.service';
import { CreateEtudiantDto } from './dto/create-etudiant.dto';
export declare class EtudiantController {
    private readonly etudiantService;
    constructor(etudiantService: EtudiantService);
    create(createEtudiantDto: CreateEtudiantDto): Promise<import("./domain/etudiant.entity").Etudiant>;
    findAll(): Promise<import("./domain/etudiant.entity").Etudiant[]>;
    findOne(id: string): Promise<import("./domain/etudiant.entity").Etudiant>;
}
