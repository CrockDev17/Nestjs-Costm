import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';

import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { PresenceSession } from './presence-session.entity.js';

export enum StatutPresence {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  RETARD = 'RETARD',
  EXCUSE = 'EXCUSE',
}

@Entity('presences')
@Index(['session', 'etudiant'], { unique: true })
export class Presence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: StatutPresence,
    default: StatutPresence.PRESENT,
  })
  statut: StatutPresence;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  justification: string | null;

  @ManyToOne(
    () => Etudiant,
    (etudiant) => etudiant.presences,
    { onDelete: 'CASCADE' },
  )
  etudiant: Etudiant;

  @ManyToOne(
    () => PresenceSession,
    (session) => session.presences,
    { nullable: true, onDelete: 'SET NULL' },
  )
  session: PresenceSession | null;
}

