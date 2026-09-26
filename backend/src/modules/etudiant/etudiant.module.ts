import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etudiant } from './domain/etudiant.entity.js';
import { EtudiantService } from './etudiant.service.js';
import { EtudiantController } from './etudiant.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Etudiant])],
  controllers: [EtudiantController],
  providers: [EtudiantService],
  exports: [EtudiantService, TypeOrmModule],
})
export class EtudiantModule {}