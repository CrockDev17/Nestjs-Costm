import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EtudiantService } from './etudiant.service.js';
import { CreateEtudiantDto } from './dto/create-etudiant.dto.js';
import { UpdateEtudiantDto } from './dto/update-etudiant.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../entities/user.entity.js';

@Controller('etudiants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EtudiantController {
  constructor(private readonly etudiantService: EtudiantService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createEtudiantDto: CreateEtudiantDto) {
    return this.etudiantService.create(createEtudiantDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ENSEIGNANT)
  findAll() {
    return this.etudiantService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ENSEIGNANT, UserRole.ETUDIANT)
  findOne(@Param('id') id: string) {
    return this.etudiantService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateEtudiantDto: UpdateEtudiantDto,
  ) {
    return this.etudiantService.update(id, updateEtudiantDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.etudiantService.remove(id);
  }
}