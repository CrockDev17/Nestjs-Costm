import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { Etudiant } from './etudiant.entity.js';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matiere: string;

  @Column('decimal', { precision: 4, scale: 2 })
  valeur: number;

  @ManyToOne('Etudiant', (etudiant: Etudiant) => etudiant.notes)
  etudiant: Etudiant;
}