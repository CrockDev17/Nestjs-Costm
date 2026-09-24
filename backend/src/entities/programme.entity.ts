import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Etudiant } from './etudiant.entity.js';

@Entity('programmes')
export class Programme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  libelle: string;

  @OneToMany(() => Etudiant, (etudiant) => etudiant.programme)
  etudiants: Etudiant[];
}