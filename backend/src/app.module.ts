import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from './core/config/typeorm.config';

import { EtudiantModule } from './modules/etudiant/etudiant.module.js';
import { PresenceModule } from './modules/presence/presence.module.js';
import { ProgrammeModule } from './modules/programme/programme.module.js';
import { NoteModule } from './modules/note/note.module.js';
import { PaiementModule } from './modules/paiement/paiement.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    EtudiantModule,
    PresenceModule,
    ProgrammeModule,
    NoteModule,
    PaiementModule,
  ],
})
export class AppModule {}