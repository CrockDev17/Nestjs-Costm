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
exports.EtudiantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const etudiant_entity_js_1 = require("./domain/etudiant.entity.js");
let EtudiantService = class EtudiantService {
    etudiantRepository;
    constructor(etudiantRepository) {
        this.etudiantRepository = etudiantRepository;
    }
    async create(createEtudiantDto) {
        const etudiant = this.etudiantRepository.create(createEtudiantDto);
        return await this.etudiantRepository.save(etudiant);
    }
    async findAll() {
        return await this.etudiantRepository.find({ relations: { presences: true, } });
    }
    async findOne(id) {
        const etudiant = await this.etudiantRepository.findOne({
            where: { id },
            relations: { presences: true },
        });
        if (!etudiant) {
            throw new common_1.NotFoundException(`Étudiant avec l'ID ${id} non trouvé`);
        }
        return etudiant;
    }
};
exports.EtudiantService = EtudiantService;
exports.EtudiantService = EtudiantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(etudiant_entity_js_1.Etudiant)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EtudiantService);
//# sourceMappingURL=etudiant.service.js.map