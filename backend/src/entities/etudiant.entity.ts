import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity.js';
import { Programme } from './programme.entity.js';
import { Note } from './note.entity.js';
import { Paiement } from './paiement.entity.js';
import { Diplome } from './diplome.entity.js';
import  type {Presence} from './presence.entity.js';
@Entity('etudiants')
export class Etudiant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  matricule: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Programme, (programme) => programme.etudiants)
  programme: Programme;

  @OneToMany(() => Note, (note) => note.etudiant)
  notes: Note[];

  @OneToMany(() => Paiement, (paiement) => paiement.etudiant)
  paiements: Paiement[];

  @OneToMany(() => Diplome, (diplome) => diplome.etudiant)
  diplomes: Diplome[];
  @OneToMany('Presence', (presence: Presence) => presence.etudiant)
  presences: Presence[];
}
    
