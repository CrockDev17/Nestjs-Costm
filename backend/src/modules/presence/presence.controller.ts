import { Controller, Get, Post, Body } from '@nestjs/common';
import { PresenceService } from './presence.service.js';
import { CreatePresenceDto } from './dto/create-presence.dto.js';

@Controller('presences')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post()
  create(@Body() createPresenceDto: CreatePresenceDto) {
    return this.presenceService.create(createPresenceDto);
  }

  @Get()
  findAll() {
    return this.presenceService.findAll();
  }
}