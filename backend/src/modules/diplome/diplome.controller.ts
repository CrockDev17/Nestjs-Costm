import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';

import { DiplomeService } from './diplome.service.js';
import { CreateDiplomeDto } from './dto/create-diplome.dto.js';

@Controller('diplomes')
export class DiplomeController {
  constructor(
    private readonly diplomeService: DiplomeService,
  ) {}

  @Post()
  create(@Body() createDiplomeDto: CreateDiplomeDto) {
    return this.diplomeService.create(createDiplomeDto);
  }

  @Get()
  findAll() {
    return this.diplomeService.findAll();
  }

  @Get('verify/:reference')
  verify(@Param('reference') reference: string) {
    return this.diplomeService.verify(reference);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diplomeService.findOne(id);
  }
}