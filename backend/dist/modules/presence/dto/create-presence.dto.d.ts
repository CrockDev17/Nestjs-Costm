import { StatutPresence } from '../presence.entity.js';
export declare class CreatePresenceDto {
    statut: StatutPresence;
    date: string;
    justification?: string;
    etudiantId: string;
}
