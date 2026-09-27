import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Presence } from '../../presence/presence.entity.js';
import { Programme } from '../../programme/domain/programme.entity.js';
import { Note } from '../../note/domain/note.entity.js';
import { Paiement } from '../../paiement/domain/paiement.entity.js';

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

  @ManyToOne(
    () => Programme,
    (programme) => programme.etudiants,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  programme: Programme;

@OneToMany(
  () => Presence,
  (presence) => presence.etudiant,
)
presences: Presence[];

@OneToMany(
  () => Note,
  (note) => note.etudiant,
)
notes: Note[];

@OneToMany(
  () => Paiement,
  (paiement) => paiement.etudiant,
)
paiements: Paiement[];
}