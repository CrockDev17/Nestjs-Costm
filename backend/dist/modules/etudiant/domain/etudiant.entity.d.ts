import { Presence } from '../../presence/presence.entity.js';
import { Programme } from '../../programme/domain/programme.entity.js';
import { Note } from '../../note/domain/note.entity.js';
import { Paiement } from '../../paiement/domain/paiement.entity.js';
export declare class Etudiant {
    id: string;
    matricule: string;
    nom: string;
    prenom: string;
    email: string;
    programme: Programme;
    presences: Presence[];
    notes: Note[];
    paiements: Paiement[];
}
