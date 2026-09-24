import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programme } from '../entities/programme.entity.js';
import { ProgrammeService } from './programme.service.js';
import { ProgrammeController } from './programme.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Programme])],
  controllers: [ProgrammeController],
  providers: [ProgrammeService],
  exports: [ProgrammeService],
})
export class ProgrammeModule {}