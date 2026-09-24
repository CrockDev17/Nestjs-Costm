import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ProgrammeService } from './programme.service.js';
import { CreateProgrammeDto } from './dto/create-programme.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../entities/user.entity.js';

@Controller('programmes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgrammeController {
  constructor(private readonly programmeService: ProgrammeService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createProgrammeDto: CreateProgrammeDto) {
    return this.programmeService.create(createProgrammeDto);
  }

  @Get()
  findAll() {
    return this.programmeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programmeService.findOne(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.programmeService.remove(id);
  }
}