import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from './domain/user.entity.js';
import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const email = createUserDto.email.trim().toLowerCase();
    const password = createUserDto.password;
    const etudiantId = createUserDto.etudiantId;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        'Un utilisateur avec cet email existe deja',
      );
    }

    if (!etudiantId) {
      throw new BadRequestException(
        'Un compte etudiant doit etre associe a un dossier etudiant',
      );
    }

    const etudiant = await this.etudiantRepository.findOne({
      where: { id: etudiantId },
    });

    if (!etudiant) {
      throw new NotFoundException('Etudiant introuvable');
    }

    const compteExistant = await this.userRepository.findOne({
      where: {
        etudiant: { id: etudiantId },
      },
      relations: {
        etudiant: true,
      },
    });

    if (compteExistant) {
      throw new ConflictException(
        'Cet etudiant possede deja un compte de connexion',
      );
    }

    const hashedPassword = await this.hashPassword(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: UserRole.ETUDIANT,
      etudiant,
    });

    const savedUser = await this.userRepository.save(user);
    return this.removePassword(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: email.trim().toLowerCase() },
      relations: {
        etudiant: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: {
        etudiant: true,
      },
    });
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find({
      relations: {
        etudiant: true,
      },
    });

    return users.map((user) => this.removePassword(user));
  }

  async findMe(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return this.removePassword(user);
  }

  private async hashPassword(password: string): Promise<string> {
    return await import('bcryptjs').then((bcrypt) =>
      bcrypt.hash(password, 12),
    );
  }

  removePassword(user: User): Omit<User, 'password'> {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}