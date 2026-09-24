import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import type { Etudiant } from './etudiant.entity.js';

@Entity('diplomes')
export class Diplome {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codeVerification: string;

  @Column('text', { nullable: true })
  qrCodeData: string;

  @CreateDateColumn()
  dateEmission: Date;

  @ManyToOne('Etudiant', (etudiant: Etudiant) => etudiant.diplomes)
  etudiant: Etudiant;
}