import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module.js'; // Assurez-vous du bon chemin
import { Programme } from '../entities/programme.entity.js';
import { ProgrammeService } from './programme.service.js';
import { ProgrammeController } from './programme.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Programme]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule, // <-- Ajoutez AuthModule ici
  ],
  controllers: [ProgrammeController],
  providers: [ProgrammeService],
  exports: [ProgrammeService],
})
export class ProgrammeModule {}