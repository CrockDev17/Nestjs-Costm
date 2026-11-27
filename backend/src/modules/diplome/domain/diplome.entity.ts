import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Etudiant } from '../../etudiant/domain/etudiant.entity.js';

export enum TypeDiplome {
  LICENCE = 'LICENCE',
  MASTER = 'MASTER',
  BTS = 'BTS',
  AUTRE = 'AUTRE',
}

@Entity('diplomes')
export class Diplome {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numero: string;

  @Column({
    type: 'enum',
    enum: TypeDiplome,
  })
  type: TypeDiplome;

  @Column({ type: 'date' })
  dateObtention: string;

  @Column({ unique: true })
  reference: string;

  @Column({ nullable: true })
  mention: string;

  @ManyToOne(
    () => Etudiant,
    (etudiant) => etudiant.diplomes,
    { onDelete: 'CASCADE' },
  )
  etudiant: Etudiant;
}