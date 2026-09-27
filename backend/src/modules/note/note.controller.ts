import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';

import { NoteService } from './note.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';

@Controller('notes')
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