import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './domain/user.entity.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';

import { Etudiant } from '../etudiant/domain/etudiant.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Etudiant,
    ]),
  ],

  controllers: [
    UserController,
  ],

  providers: [
    UserService,
  ],

  exports: [
    UserService,
  ],
})
export class UserModule {}