import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum AnnonceType {
  INFORMATION = 'INFORMATION',
  EVENEMENT = 'EVENEMENT',
  EXAMEN = 'EXAMEN',
  REUNION = 'REUNION',
  AUTRE = 'AUTRE',
}

export enum AnnonceStatut {
  BROUILLON = 'BROUILLON',
  PUBLIEE = 'PUBLIEE',
  ARCHIVEE = 'ARCHIVEE',
}

@Entity('annonces')
export class Annonce {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  titre: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: AnnonceType.INFORMATION,
  })
  type: AnnonceType;

  @Column({ type: 'timestamp', nullable: true })
  dateEvenement: Date | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  lieu: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  datePublication: Date;

  @Column({ type: 'timestamp', nullable: true })
  dateExpiration: Date | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: AnnonceStatut.BROUILLON,
  })
  statut: AnnonceStatut;
}
