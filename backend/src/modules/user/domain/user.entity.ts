import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Etudiant } from '../../etudiant/domain/etudiant.entity.js';

export enum UserRole {
  ADMIN = 'ADMIN',
  ETUDIANT = 'ETUDIANT',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ETUDIANT,
  })
  role: UserRole;

  @OneToOne(
    () => Etudiant,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'etudiant_id' })
  etudiant: Etudiant | null;
}