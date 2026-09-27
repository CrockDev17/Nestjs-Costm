import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Etudiant } from '../../etudiant/domain/etudiant.entity.js';

export enum StatutPaiement {
  PAYE = 'PAYE',
  PARTIEL = 'PARTIEL',
  IMPAYE = 'IMPAYE',
}

@Entity('paiements')
export class Paiement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  montant: number;

  @Column({ type: 'date' })
  date: string;

  @Column()
  motif: string;

  @Column({
    type: 'enum',
    enum: StatutPaiement,
    default: StatutPaiement.PAYE,
  })
  statut: StatutPaiement;

  @Column({ unique: true })
  reference: string;

  @ManyToOne(
    () => Etudiant,
    (etudiant) => etudiant.paiements,
    { onDelete: 'CASCADE' },
  )
  etudiant: Etudiant;
}