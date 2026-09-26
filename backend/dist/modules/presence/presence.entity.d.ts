import { Etudiant } from '../etudiant/domain/etudiant.entity';
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
    justification: string;
    etudiant: Etudiant;
}
