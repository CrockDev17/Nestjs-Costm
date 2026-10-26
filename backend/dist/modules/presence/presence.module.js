"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const presence_entity_js_1 = require("./presence.entity.js");
const presence_session_entity_js_1 = require("./presence-session.entity.js");
const presence_service_js_1 = require("./presence.service.js");
const presence_controller_js_1 = require("./presence.controller.js");
const etudiant_entity_js_1 = require("../etudiant/domain/etudiant.entity.js");
const user_entity_js_1 = require("../user/domain/user.entity.js");
let PresenceModule = class PresenceModule {
};
exports.PresenceModule = PresenceModule;
exports.PresenceModule = PresenceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                presence_entity_js_1.Presence,
                presence_session_entity_js_1.PresenceSession,
                etudiant_entity_js_1.Etudiant,
                user_entity_js_1.User,
            ]),
        ],
        controllers: [presence_controller_js_1.PresenceController],
        providers: [presence_service_js_1.PresenceService],
    })
], PresenceModule);
//# sourceMappingURL=presence.module.js.map