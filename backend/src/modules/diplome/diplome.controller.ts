import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { DiplomeService } from './diplome.service.js';
import { CreateDiplomeDto } from './dto/create-diplome.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/domain/user.entity.js';

@Controller('diplomes')
export class DiplomeController {
  constructor(
    private readonly diplomeService: DiplomeService,
  ) {}

  // ==========================================
  // CRÉER UN DIPLÔME
  // ADMIN UNIQUEMENT
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    createDiplomeDto: CreateDiplomeDto,
  ) {
    return this.diplomeService.create(
      createDiplomeDto,
    );
  }

  // ==========================================
  // DIPLÔMES DE L'ÉTUDIANT CONNECTÉ
  // JWT UNIQUEMENT
  // ==========================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyDiplomes(@Req() req: any) {
    return this.diplomeService.findMyDiplomes(
      req.user.sub,
    );
  }

  // ==========================================
  // VÉRIFICATION PUBLIQUE D'UN DIPLÔME
  // AUCUN JWT
  // ==========================================

  @Get('verify/:reference')
  verify(
    @Param('reference') reference: string,
  ) {
    return this.diplomeService.verify(
      reference,
    );
  }

  // ==========================================
  // TOUS LES DIPLÔMES
  // ADMIN UNIQUEMENT
  // ==========================================

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.diplomeService.findAll();
  }

  // ==========================================
  // UN DIPLÔME PAR ID
  // ADMIN UNIQUEMENT
  // ==========================================

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(
    @Param('id') id: string,
  ) {
    return this.diplomeService.findOne(id);
  }
}