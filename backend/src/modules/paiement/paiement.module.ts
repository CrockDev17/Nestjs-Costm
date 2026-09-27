import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Paiement } from './domain/paiement.entity.js';
import { PaiementService } from './paiement.service.js';
import { PaiementController } from './paiement.controller.js';
import { EtudiantModule } from '../etudiant/etudiant.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paiement]),
    EtudiantModule,
  ],
  controllers: [PaiementController],
  providers: [PaiementService],
})
export class PaiementModule {}