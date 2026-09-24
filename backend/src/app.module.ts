import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { User } from './entities/user.entity.js';
import { Etudiant } from './entities/etudiant.entity.js';
import { Programme } from './entities/programme.entity.js';
import { Note } from './entities/note.entity.js';
import { Paiement } from './entities/paiement.entity.js';
import { Diplome } from './entities/diplome.entity.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Crockb13123',
      database: 'costm_db',
      entities: [User, Etudiant, Programme, Note, Paiement, Diplome],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}