import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Presence } from './presence.entity.js';
import { PresenceService } from './presence.service.js';
import { PresenceController } from './presence.controller.js';

import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { User } from '../user/domain/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Presence,
      Etudiant,
      User,
    ]),
  ],
  controllers: [
    PresenceController,
  ],
  providers: [
    PresenceService,
  ],
})
export class PresenceModule {}