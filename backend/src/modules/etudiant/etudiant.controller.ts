import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { EtudiantService } from './etudiant.service.js';
import { CreateEtudiantDto } from './dto/create-etudiant.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/domain/user.entity.js';

@Controller('etudiants')
export class EtudiantController {
  constructor(
    private readonly etudiantService: EtudiantService,
  ) {}

  // ==========================================
  // CRÉER UN ÉTUDIANT
  // ADMIN UNIQUEMENT
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    createEtudiantDto: CreateEtudiantDto,
  ) {
    return this.etudiantService.create(
      createEtudiantDto,
    );
  }

  // ==========================================
  // RÉCUPÉRER SON PROPRE PROFIL
  // ÉTUDIANT CONNECTÉ
  // ==========================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@Req() req: any) {
    return this.etudiantService.findMe(
      req.user.sub,
    );
  }

  // ==========================================
  // RÉCUPÉRER TOUS LES ÉTUDIANTS
  // ADMIN UNIQUEMENT
  // ==========================================

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.etudiantService.findAll();
  }

  // ==========================================
  // RÉCUPÉRER UN ÉTUDIANT PAR ID
  // ADMIN UNIQUEMENT
  // ==========================================

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(
    @Param('id') id: string,
  ) {
    return this.etudiantService.findOne(id);
  }
}