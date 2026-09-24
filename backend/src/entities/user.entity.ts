import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  ENSEIGNANT = 'ENSEIGNANT',
  ETUDIANT = 'ETUDIANT',
  COMPTABLE = 'COMPTABLE',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  motDePasse: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ETUDIANT,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}