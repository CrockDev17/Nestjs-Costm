import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presence } from './presence.entity.js';
import { PresenceService } from './presence.service.js';
import { PresenceController } from './presence.controller.js';
import { EtudiantModule } from '../etudiant/etudiant.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Presence]), EtudiantModule],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}