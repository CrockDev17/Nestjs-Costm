import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from './domain/etudiant.entity';
import { EtudiantService } from './etudiant.service';
import { EtudiantController } from './etudiant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Etudiant])],
  controllers: [EtudiantController],
  providers: [EtudiantService],
  exports: [EtudiantService, TypeOrmModule],
})
export class EtudiantModule {}