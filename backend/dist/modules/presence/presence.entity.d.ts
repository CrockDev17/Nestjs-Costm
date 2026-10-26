import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { PresenceSession } from './presence-session.entity.js';
export declare enum StatutPresence {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    RETARD = "RETARD",
    EXCUSE = "EXCUSE"
}
export declare class Presence {
    id: string;
    statut: StatutPresence;
    date: string;
    justification: string | null;
    etudiant: Etudiant;
    session: PresenceSession | null;
}
