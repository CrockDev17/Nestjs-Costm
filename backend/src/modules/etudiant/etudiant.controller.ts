import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EtudiantService } from './etudiant.service.js';
import { CreateEtudiantDto } from './dto/create-etudiant.dto.js';

@Controller('etudiants')
export class EtudiantController {
  constructor(private readonly etudiantService: EtudiantService) {}

  @Post()
  create(@Body() createEtudiantDto: CreateEtudiantDto) {
    return this.etudiantService.create(createEtudiantDto);
  }

  @Get()
  findAll() {
    return this.etudiantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.etudiantService.findOne(id);
  }
}