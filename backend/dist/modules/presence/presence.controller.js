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
exports.PresenceController = void 0;
const common_1 = require("@nestjs/common");
const presence_service_js_1 = require("./presence.service.js");
const create_presence_dto_js_1 = require("./dto/create-presence.dto.js");
let PresenceController = class PresenceController {
    presenceService;
    constructor(presenceService) {
        this.presenceService = presenceService;
    }
    create(createPresenceDto) {
        return this.presenceService.create(createPresenceDto);
    }
    findAll() {
        return this.presenceService.findAll();
    }
};
exports.PresenceController = PresenceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_presence_dto_js_1.CreatePresenceDto]),
    __metadata("design:returntype", void 0)
], PresenceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PresenceController.prototype, "findAll", null);
exports.PresenceController = PresenceController = __decorate([
    (0, common_1.Controller)('presences'),
    __metadata("design:paramtypes", [presence_service_js_1.PresenceService])
], PresenceController);
//# sourceMappingURL=presence.controller.js.map