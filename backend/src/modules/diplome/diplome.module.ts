import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Diplome } from './domain/diplome.entity.js';
import { DiplomeService } from './diplome.service.js';
import { DiplomeController } from './diplome.controller.js';
import { EtudiantModule } from '../etudiant/etudiant.module.js';
import { User } from '../user/domain/user.entity.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Diplome, User]),
        EtudiantModule,
    ],
    controllers: [DiplomeController],
    providers: [DiplomeService],
})
export class DiplomeModule { }