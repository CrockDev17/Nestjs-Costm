import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Presence } from './presence.entity.js';

@Entity('presence_sessions')
export class PresenceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  cours: string;

  @Column({ type: 'uuid', unique: true })
  token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  closedAt: Date | null;

  @Column({ type: 'uuid' })
  createdBy: string;

  @OneToMany(() => Presence, (presence) => presence.session)
  presences: Presence[];
}
