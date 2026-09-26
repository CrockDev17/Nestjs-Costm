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
exports.EtudiantController = void 0;
const common_1 = require("@nestjs/common");
const etudiant_service_js_1 = require("./etudiant.service.js");
const create_etudiant_dto_js_1 = require("./dto/create-etudiant.dto.js");
let EtudiantController = class EtudiantController {
    etudiantService;
    constructor(etudiantService) {
        this.etudiantService = etudiantService;
    }
    create(createEtudiantDto) {
        return this.etudiantService.create(createEtudiantDto);
    }
    findAll() {
        return this.etudiantService.findAll();
    }
    findOne(id) {
        return this.etudiantService.findOne(id);
    }
};
exports.EtudiantController = EtudiantController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_etudiant_dto_js_1.CreateEtudiantDto]),
    __metadata("design:returntype", void 0)
], EtudiantController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EtudiantController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EtudiantController.prototype, "findOne", null);
exports.EtudiantController = EtudiantController = __decorate([
    (0, common_1.Controller)('etudiants'),
    __metadata("design:paramtypes", [etudiant_service_js_1.EtudiantService])
], EtudiantController);
//# sourceMappingURL=etudiant.controller.js.map