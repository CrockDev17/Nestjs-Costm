import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { PresenceService } from './presence.service.js';
import { CreatePresenceDto } from './dto/create-presence.dto.js';
import { UpdatePresenceDto } from './dto/update-presence.dto.js';
import { CreatePresenceSessionDto } from './dto/create-presence-session.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/domain/user.entity.js';

@Controller('presences')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreatePresenceDto) {
    return this.presenceService.create(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyPresences(@Req() req: any) {
    return this.presenceService.findMyPresences(req.user.sub);
  }

  // Routes QR : l'ordre évite de confondre "sessions" avec un identifiant de présence.
  @Post('sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createSession(@Body() dto: CreatePresenceSessionDto, @Req() req: any) {
    return this.presenceService.createSession(dto, req.user.sub);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  listSessions() {
    return this.presenceService.listSessions();
  }

  @Get('sessions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getSession(@Param('id') id: string) {
    return this.presenceService.getSession(id);
  }

  @Patch('sessions/:id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  closeSession(@Param('id') id: string) {
    return this.presenceService.closeSession(id);
  }

  @Post('sessions/:token/scan')
  @UseGuards(JwtAuthGuard)
  scanSession(@Param('token') token: string, @Req() req: any) {
    return this.presenceService.scanSession(token, req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.presenceService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.presenceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdatePresenceDto) {
    return this.presenceService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.presenceService.remove(id);
  }
}
