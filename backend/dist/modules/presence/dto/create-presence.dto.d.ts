import { StatutPresence } from '../presence.entity';
export declare class CreatePresenceDto {
    statut: StatutPresence;
    date: string;
    justification?: string;
    etudiantId: string;
}
