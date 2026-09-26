import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';

import { ProgrammeService } from './programme.service';
import { CreateProgrammeDto } from './dto/create-programme.dto';

@Controller('programmes')
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