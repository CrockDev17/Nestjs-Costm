import { StatutPresence } from '../../entities/presence.entity.js';

export class CreatePresenceDto {
  date?: string;
  statut: StatutPresence;
  justification?: string;
  etudiantId: string;
}