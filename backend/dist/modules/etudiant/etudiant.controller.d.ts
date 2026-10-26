import { EtudiantService } from './etudiant.service.js';
import { CreateEtudiantDto } from './dto/create-etudiant.dto.js';
import { UpdateEtudiantDto } from './dto/update-etudiant.dto.js';
export declare class EtudiantController {
    private readonly etudiantService;
    constructor(etudiantService: EtudiantService);
    create(createEtudiantDto: CreateEtudiantDto): Promise<import("./domain/etudiant.entity.js").Etudiant>;
    findMe(req: any): Promise<import("./domain/etudiant.entity.js").Etudiant>;
    findAll(): Promise<import("./domain/etudiant.entity.js").Etudiant[]>;
    findOne(id: string): Promise<import("./domain/etudiant.entity.js").Etudiant>;
    update(id: string, updateEtudiantDto: UpdateEtudiantDto): Promise<import("./domain/etudiant.entity.js").Etudiant>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
