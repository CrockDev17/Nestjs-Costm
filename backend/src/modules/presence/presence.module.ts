import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presence } from './presence.entity.js';
import { PresenceService } from './presence.service.js';
import { PresenceController } from './presence.controller.js';
import { EtudiantModule } from '../etudiant/etudiant.module.js';
import { User } from '../user/domain/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Presence, User]), EtudiantModule],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule { }