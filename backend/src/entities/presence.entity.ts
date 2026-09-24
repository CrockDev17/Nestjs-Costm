import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import type { Etudiant } from './etudiant.entity.js';

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

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'enum', enum: StatutPresence, default: StatutPresence.PRESENT })
  statut: StatutPresence;

  @Column({ nullable: true })
  justification: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne('Etudiant', (etudiant: any) => etudiant.presences, { onDelete: 'CASCADE' })
etudiant: Etudiant;
}