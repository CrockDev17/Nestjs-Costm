import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './core/config/typeorm.config';
import { EtudiantModule } from './modules/etudiant/etudiant.module.js';
import { PresenceModule } from './modules/presence/presence.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    EtudiantModule,
    PresenceModule,
  ],
})
export class AppModule {}