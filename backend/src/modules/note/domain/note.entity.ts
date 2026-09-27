import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Etudiant } from '../../etudiant/domain/etudiant.entity.js';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  valeur: number;

  @Column()
  matiere: string;

  @Column({ nullable: true })
  semestre: string;

  @ManyToOne(
    () => Etudiant,
    (etudiant) => etudiant.notes,
    { onDelete: 'CASCADE' },
  )
  etudiant: Etudiant;
}