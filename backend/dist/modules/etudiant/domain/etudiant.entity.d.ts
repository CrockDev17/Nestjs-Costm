import { Presence } from '../../presence/presence.entity.js';
import { Programme } from '../../programme/domain/programme.entity.js';
export declare class Etudiant {
    id: string;
    matricule: string;
    nom: string;
    prenom: string;
    email: string;
    programme: Programme;
    presences: Presence[];
}
