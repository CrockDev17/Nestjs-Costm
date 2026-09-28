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
import { ProgrammeService } from './programme.service';
import { CreateProgrammeDto } from './dto/create-programme.dto';

@Controller('programmes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ProgrammeController {
  constructor(
    private readonly programmeService: ProgrammeService,
  ) {}

  @Post()
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
}