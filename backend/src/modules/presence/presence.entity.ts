import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Etudiant } from '../etudiant/domain/etudiant.entity';

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

  @Column({ nullable: true })
  justification: string;

  @ManyToOne(
    () => Etudiant,
    (etudiant) => etudiant.presences,
    { onDelete: 'CASCADE' },
  )
  etudiant: Etudiant;
}