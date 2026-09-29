import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { PresenceService } from './presence.service.js';
import { CreatePresenceDto } from './dto/create-presence.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/domain/user.entity.js';

@Controller('presences')
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
  ) {}

  // ==========================================
  // CRÉER UNE PRÉSENCE
  // ADMIN UNIQUEMENT
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    createPresenceDto: CreatePresenceDto,
  ) {
    return this.presenceService.create(
      createPresenceDto,
    );
  }

  // ==========================================
  // PRÉSENCES DE L'ÉTUDIANT CONNECTÉ
  // JWT UNIQUEMENT
  // ==========================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyPresences(@Req() req: any) {
    return this.presenceService.findMyPresences(
      req.user.sub,
    );
  }

  // ==========================================
  // TOUTES LES PRÉSENCES
  // ADMIN UNIQUEMENT
  // ==========================================

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.presenceService.findAll();
  }

  // ==========================================
  // UNE PRÉSENCE PAR ID
  // ADMIN UNIQUEMENT
  // ==========================================

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(
    @Param('id') id: string,
  ) {
    return this.presenceService.findOne(id);
  }
}