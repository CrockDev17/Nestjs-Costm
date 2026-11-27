import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Diplome } from './domain/diplome.entity.js';
import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { CreateDiplomeDto } from './dto/create-diplome.dto.js';
import { User } from '../user/domain/user.entity.js';

@Injectable()
export class DiplomeService {
    constructor(
        @InjectRepository(Diplome)
        private readonly diplomeRepository: Repository<Diplome>,

        @InjectRepository(Etudiant)
        private readonly etudiantRepository: Repository<Etudiant>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(
        createDiplomeDto: CreateDiplomeDto,
    ): Promise<Diplome> {
        const { etudiantId, ...diplomeData } = createDiplomeDto;

        const etudiant = await this.etudiantRepository.findOne({
            where: { id: etudiantId },
        });

        if (!etudiant) {
            throw new NotFoundException(
                'Étudiant introuvable pour ce diplôme',
            );
        }

        const diplome = this.diplomeRepository.create({
            ...diplomeData,
            etudiant,
        });

        return await this.diplomeRepository.save(diplome);
    }

    async findAll(): Promise<Diplome[]> {
        return await this.diplomeRepository.find({
            relations: {
                etudiant: true,
            },
        });
    }

    async findOne(id: string): Promise<Diplome> {
        const diplome = await this.diplomeRepository.findOne({
            where: { id },
            relations: {
                etudiant: true,
            },
        });

        if (!diplome) {
            throw new NotFoundException(
                `Diplôme avec l'ID ${id} non trouvé`,
            );
        }

        return diplome;
    }

    async verify(reference: string): Promise<Diplome> {
        const diplome = await this.diplomeRepository.findOne({
            where: { reference },
            relations: {
                etudiant: true,
            },
        });

        if (!diplome) {
            throw new NotFoundException(
                'Diplôme non trouvé ou référence invalide',
            );
        }

        return diplome;
    }
    async findMyDiplomes(
        userId: string,
    ): Promise<Diplome[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                etudiant: true,
            },
        });

        if (!user) {
            throw new NotFoundException(
                'Utilisateur introuvable',
            );
        }

        if (!user.etudiant) {
            throw new NotFoundException(
                'Aucun étudiant associé à cet utilisateur',
            );
        }

        return await this.diplomeRepository.find({
            where: {
                etudiant: {
                    id: user.etudiant.id,
                },
            },
        });
    }
}