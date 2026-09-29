import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { PaiementService } from './paiement.service.js';
import { CreatePaiementDto } from './dto/create-paiement.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/domain/user.entity.js';

@Controller('paiements')
export class PaiementController {
  constructor(
    private readonly paiementService: PaiementService,
  ) {}

  // ==========================================
  // CRÉER UN PAIEMENT
  // ADMIN UNIQUEMENT
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    createPaiementDto: CreatePaiementDto,
  ) {
    return this.paiementService.create(
      createPaiementDto,
    );
  }

  // ==========================================
  // PAIEMENTS DE L'ÉTUDIANT CONNECTÉ
  // JWT UNIQUEMENT
  // ==========================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyPaiements(@Req() req: any) {
    return this.paiementService.findMyPaiements(
      req.user.sub,
    );
  }

  // ==========================================
  // TOUS LES PAIEMENTS
  // ADMIN UNIQUEMENT
  // ==========================================

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.paiementService.findAll();
  }

  // ==========================================
  // UN PAIEMENT PAR ID
  // ADMIN UNIQUEMENT
  // ==========================================

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(
    @Param('id') id: string,
  ) {
    return this.paiementService.findOne(id);
  }
}