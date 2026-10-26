import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { AnnonceService } from './annonce.service.js';
import { CreateAnnonceDto } from './dto/create-annonce.dto.js';
import { UpdateAnnonceDto } from './dto/update-annonce.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/domain/user.entity.js';

@Controller('annonces')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AnnonceController {
  constructor(
    private readonly annonceService: AnnonceService,
  ) {}

  @Post()
  create(@Body() dto: CreateAnnonceDto) {
    return this.annonceService.create(dto);
  }

  @Get()
  findAll() {
    return this.annonceService.findAll();
  }

  @Get('publiees')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ETUDIANT)
  findPublished() {
    return this.annonceService.findPublished();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.annonceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAnnonceDto,
  ) {
    return this.annonceService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.annonceService.remove(id);
  }
}
