import type { PresenceSession } from '../entities/PresenceSession';

export interface PresenceSessionRepository {
  create(cours: string): Promise<PresenceSession>;
  list(): Promise<PresenceSession[]>;
  close(id: string): Promise<PresenceSession>;
  scan(token: string): Promise<unknown>;
}
