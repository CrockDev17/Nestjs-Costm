import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presence } from './presence.entity';
import { PresenceService } from './presence.service';
import { PresenceController } from './presence.controller';
import { EtudiantModule } from '../etudiant/etudiant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Presence]), EtudiantModule],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}