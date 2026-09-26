import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Etudiant } from '../../etudiant/domain/etudiant.entity.js';

@Entity('programmes')
export class Programme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  nom: string;

  @Column()
  niveau: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Etudiant, (etudiant) => etudiant.programme)
  etudiants: Etudiant[];
}