import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Etudiant } from './etudiant.entity.js';

export enum StatutPresence {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  RETARD = 'RETARD',
  EXCUSE = 'EXCUSE',
}

@Entity('presences')
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
}