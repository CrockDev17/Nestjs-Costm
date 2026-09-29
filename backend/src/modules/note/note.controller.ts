import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { NoteService } from './note.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/domain/user.entity.js';

@Controller('notes')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
  ) {}

  // ==========================================
  // CRÉER UNE NOTE
  // ADMIN UNIQUEMENT
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    createNoteDto: CreateNoteDto,
  ) {
    return this.noteService.create(
      createNoteDto,
    );
  }

  // ==========================================
  // NOTES DE L'ÉTUDIANT CONNECTÉ
  // JWT UNIQUEMENT
  // ==========================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyNotes(@Req() req: any) {
    return this.noteService.findMyNotes(
      req.user.sub,
    );
  }

  // ==========================================
  // TOUTES LES NOTES
  // ADMIN UNIQUEMENT
  // ==========================================

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.noteService.findAll();
  }

  // ==========================================
  // UNE NOTE PAR ID
  // ADMIN UNIQUEMENT
  // ==========================================

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(
    @Param('id') id: string,
  ) {
    return this.noteService.findOne(id);
  }
}