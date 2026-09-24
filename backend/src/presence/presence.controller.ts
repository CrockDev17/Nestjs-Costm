import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { PresenceService } from './presence.service.js';
import { CreatePresenceDto } from './dto/create-presence.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../entities/user.entity.js';

@Controller('presences')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ENSEIGNANT)
  create(@Body() createPresenceDto: CreatePresenceDto) {
    return this.presenceService.create(createPresenceDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ENSEIGNANT)
  findAll() {
    return this.presenceService.findAll();
  }

  @Get('etudiant/:etudiantId')
  findByEtudiant(@Param('etudiantId') etudiantId: string) {
    return this.presenceService.findByEtudiant(etudiantId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.presenceService.remove(id);
  }
}