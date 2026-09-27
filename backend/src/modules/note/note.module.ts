import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Note } from './domain/note.entity.js';
import { NoteService } from './note.service.js';
import { NoteController } from './note.controller.js';
import { EtudiantModule } from '../etudiant/etudiant.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note]),
    EtudiantModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}