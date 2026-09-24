import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(userData: any) {
    if (!userData.email || !userData.motDePasse) {
      throw new BadRequestException('L\'email et le mot de passe sont obligatoires.');
    }

    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.motDePasse, salt);

    const newUser = this.userRepository.create({
      ...userData,
      motDePasse: hashedPassword,
    });

    await this.userRepository.save(newUser);

    delete (newUser as any).motDePasse;
    return newUser;
  }

  async login(credentials: { email: string; motDePasse: string }) {
    const user = await this.userRepository.findOne({ where: { email: credentials.email } });
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const isMatch = await bcrypt.compare(credentials.motDePasse, user.motDePasse);
    if (!isMatch) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      },
    };
  }
}