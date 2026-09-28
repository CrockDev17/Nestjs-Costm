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
import { DiplomeService } from './diplome.service.js';
import { CreateDiplomeDto } from './dto/create-diplome.dto.js';

@Controller('diplomes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
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