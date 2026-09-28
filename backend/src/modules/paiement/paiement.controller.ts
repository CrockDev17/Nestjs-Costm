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

import { PaiementService } from './paiement.service.js';
import { CreatePaiementDto } from './dto/create-paiement.dto.js';

@Controller('paiements')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)

export class PaiementController {
  constructor(
    private readonly paiementService: PaiementService,
  ) {}

  @Post()
  create(@Body() createPaiementDto: CreatePaiementDto) {
    return this.paiementService.create(createPaiementDto);
  }

  @Get()
  findAll() {
    return this.paiementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paiementService.findOne(id);
  }
}