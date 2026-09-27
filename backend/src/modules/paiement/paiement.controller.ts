import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';

import { PaiementService } from './paiement.service.js';
import { CreatePaiementDto } from './dto/create-paiement.dto.js';

@Controller('paiements')
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