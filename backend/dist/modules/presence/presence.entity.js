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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presence = exports.StatutPresence = void 0;
const typeorm_1 = require("typeorm");
const etudiant_entity_js_1 = require("../etudiant/domain/etudiant.entity.js");
var StatutPresence;
(function (StatutPresence) {
    StatutPresence["PRESENT"] = "PRESENT";
    StatutPresence["ABSENT"] = "ABSENT";
    StatutPresence["RETARD"] = "RETARD";
    StatutPresence["EXCUSE"] = "EXCUSE";
})(StatutPresence || (exports.StatutPresence = StatutPresence = {}));
let Presence = class Presence {
    id;
    statut;
    date;
    justification;
    etudiant;
};
exports.Presence = Presence;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Presence.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StatutPresence,
        default: StatutPresence.PRESENT,
    }),
    __metadata("design:type", String)
], Presence.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Presence.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Presence.prototype, "justification", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => etudiant_entity_js_1.Etudiant, (etudiant) => etudiant.presences, { onDelete: 'CASCADE' }),
    __metadata("design:type", etudiant_entity_js_1.Etudiant)
], Presence.prototype, "etudiant", void 0);
exports.Presence = Presence = __decorate([
    (0, typeorm_1.Entity)('presences')
], Presence);
//# sourceMappingURL=presence.entity.js.map