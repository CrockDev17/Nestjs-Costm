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
exports.PresenceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const presence_entity_js_1 = require("./presence.entity.js");
const etudiant_entity_js_1 = require("../etudiant/domain/etudiant.entity.js");
let PresenceService = class PresenceService {
    presenceRepository;
    etudiantRepository;
    constructor(presenceRepository, etudiantRepository) {
        this.presenceRepository = presenceRepository;
        this.etudiantRepository = etudiantRepository;
    }
    async create(createPresenceDto) {
        const { etudiantId, ...presenceData } = createPresenceDto;
        const etudiant = await this.etudiantRepository.findOne({
            where: { id: etudiantId },
        });
        if (!etudiant) {
            throw new common_1.NotFoundException('Étudiant introuvable pour la présence');
        }
        const presence = this.presenceRepository.create({
            ...presenceData,
            etudiant,
        });
        return await this.presenceRepository.save(presence);
    }
    async findAll() {
        return await this.presenceRepository.find({
            relations: {
                etudiant: true,
            },
        });
    }
};
exports.PresenceService = PresenceService;
exports.PresenceService = PresenceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(presence_entity_js_1.Presence)),
    __param(1, (0, typeorm_1.InjectRepository)(etudiant_entity_js_1.Etudiant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PresenceService);
//# sourceMappingURL=presence.service.js.map