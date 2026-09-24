import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service.js';
import { JwtAuthGuard } from './auth/jwt-auth.guard.js';
import { RolesGuard } from './auth/roles.guard.js';
import { Roles } from './auth/roles.decorator.js';
import { UserRole } from './entities/user.entity.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Route protégée : Nécessite un Token JWT valide ET le rôle ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/test')
  getAdminData() {
    return { message: 'Accès autorisé : Vous êtes bien un ADMIN connecté !' };
  }
}