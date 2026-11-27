import { Module } from '@nestjs/common';

import {
  JwtModule,
} from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module.js';

import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

import { JwtStrategy } from './strategies/jwt.strategy.js';

import { RolesGuard } from './guards/roles.guard.js';

@Module({
  imports: [
    ConfigModule,

    UserModule,

    PassportModule,

    JwtModule.registerAsync({
      imports: [
        ConfigModule,
      ],

      inject: [
        ConfigService,
      ],

      useFactory: (
        configService: ConfigService,
      ) => {
        const secret =
          configService.get<string>(
            'JWT_SECRET',
          );

        if (!secret) {
          throw new Error(
            'JWT_SECRET est manquant dans le fichier .env',
          );
        }

        return {
          secret,

          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
  ],

  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}