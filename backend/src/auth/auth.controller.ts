import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: any) {
    console.log('Reçu en entree', userData);
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() credentials: any) {
    return this.authService.login(credentials);
  }
}