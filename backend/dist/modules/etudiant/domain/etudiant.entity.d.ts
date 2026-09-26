import { Presence } from '../../presence/presence.entity.js';
export declare class Etudiant {
    id: string;
    matricule: string;
    nom: string;
    prenom: string;
    email: string;
    presences: Presence[];
}
