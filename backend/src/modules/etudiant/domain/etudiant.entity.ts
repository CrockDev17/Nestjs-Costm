import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Presence } from '../../presence/presence.entity.js';

@Entity('etudiants')
export class Etudiant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  matricule: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Presence, (presence) => presence.etudiant, { cascade: true })
  presences: Presence[];
}