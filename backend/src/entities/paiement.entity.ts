import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { Etudiant } from './etudiant.entity.js';

@Entity('paiements')
export class Paiement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  montantTotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montantPaye: number;

  @Column({ default: false })
  estRegle: boolean;

  @Column({ type: 'date', nullable: true })
  dateEcheance: Date;

  @ManyToOne('Etudiant', (etudiant: Etudiant) => etudiant.paiements)
  etudiant: Etudiant;
}