import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProgrammeService } from './programme.service.js';
import { CreateProgrammeDto } from './dto/create-programme.dto.js';
import { UpdateProgrammeDto } from './dto/update-programme.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/domain/user.entity.js';

@Controller('programmes')
export class ProgrammeController {
  constructor(
    private readonly programmeService: ProgrammeService,
  ) {}

  // CRÉER
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body() dto: CreateProgrammeDto,
  ) {
    return this.programmeService.create(dto);
  }

  // LISTE
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.programmeService.findAll();
  }

  // UN PROGRAMME
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(
    @Param('id') id: string,
  ) {
    return this.programmeService.findOne(id);
  }

  // MODIFIER
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProgrammeDto,
  ) {
    return this.programmeService.update(id, dto);
  }

  // SUPPRIMER
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(
    @Param('id') id: string,
  ) {
    return this.programmeService.remove(id);
  }
}