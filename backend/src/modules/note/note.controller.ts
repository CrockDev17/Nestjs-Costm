import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js'; 
import { UserRole } from '../user/domain/user.entity.js';

import { NoteService } from './note.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';

@Controller('notes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)

export class NoteController {
  constructor(
    private readonly noteService: NoteService,
  ) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.noteService.create(createNoteDto);
  }

  @Get()
  findAll() {
    return this.noteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noteService.findOne(id);
  }
}