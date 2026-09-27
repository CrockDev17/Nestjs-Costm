import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Diplome } from './domain/diplome.entity.js';
import { DiplomeService } from './diplome.service.js';
import { DiplomeController } from './diplome.controller.js';
import { EtudiantModule } from '../etudiant/etudiant.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diplome]),
    EtudiantModule,
  ],
  controllers: [DiplomeController],
  providers: [DiplomeService],
})
export class DiplomeModule {}