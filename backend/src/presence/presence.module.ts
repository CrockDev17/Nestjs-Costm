import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Presence } from '../entities/presence.entity.js';
import { Etudiant } from '../entities/etudiant.entity.js';
import { PresenceService } from './presence.service.js';
import { PresenceController } from './presence.controller.js';
import { AuthModule } from '../auth/auth.module.js'; // Assurez-vous du bon chemin

@Module({
  imports: [
    TypeOrmModule.forFeature([Presence, Etudiant]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule, // <-- Ajoutez AuthModule ici
  ],
  controllers: [PresenceController],
  providers: [PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}