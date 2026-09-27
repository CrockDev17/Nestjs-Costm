import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';

import { UserService } from '../user/user.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: any) {
    return await this.userService.create(
      createUserDto,
    );
  }

  async login(loginDto: LoginDto) {
    const user =
      await this.userService.findByEmail(
        loginDto.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Email ou mot de passe incorrect',
      );
    }

    const passwordValid =
      await bcrypt.compare(
        loginDto.password,
        user.password,
      );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Email ou mot de passe incorrect',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken =
      await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,

      user: this.userService.removePassword(
        user,
      ),
    };
  }
}