import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Annonce } from './domain/annonce.entity.js';
import { AnnonceService } from './annonce.service.js';
import { AnnonceController } from './annonce.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Annonce]),
  ],
  controllers: [AnnonceController],
  providers: [AnnonceService],
})
export class AnnonceModule {}
