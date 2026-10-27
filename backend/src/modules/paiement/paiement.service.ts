import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paiement } from './domain/paiement.entity.js';
import { Etudiant } from '../etudiant/domain/etudiant.entity.js';
import { CreatePaiementDto } from './dto/create-paiement.dto.js';
import { User } from '../user/domain/user.entity.js';

@Injectable()
export class PaiementService {
    constructor(
        @InjectRepository(Paiement)
        private readonly paiementRepository: Repository<Paiement>,

        @InjectRepository(Etudiant)
        private readonly etudiantRepository: Repository<Etudiant>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(
        createPaiementDto: CreatePaiementDto,
    ): Promise<Paiement> {
        const { etudiantId, ...paiementData } = createPaiementDto;

        const etudiant = await this.etudiantRepository.findOne({
            where: { id: etudiantId },
        });

        if (!etudiant) {
            throw new NotFoundException(
                'Ã‰tudiant introuvable pour ce paiement',
            );
        }

        const paiement = this.paiementRepository.create({
            ...paiementData,
            etudiant,
        });

        return await this.paiementRepository.save(paiement);
    }

    async findAll(): Promise<Paiement[]> {
        return await this.paiementRepository.find({
            relations: {
                etudiant: true,
            },
        });
    }

    async findOne(id: string): Promise<Paiement> {
        const paiement = await this.paiementRepository.findOne({
            where: { id },
            relations: {
                etudiant: true,
            },
        });

        if (!paiement) {
            throw new NotFoundException(
                `Paiement avec l'ID ${id} non trouvÃ©`,
            );
        }

        return paiement;
    }
    async findMyPaiements(
        userId: string,
    ): Promise<Paiement[]> {
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
                'Aucun Ã©tudiant associÃ© Ã  cet utilisateur',
            );
        }

        return await this.paiementRepository.find({
            where: {
                etudiant: {
                    id: user.etudiant.id,
                },
            },
        });
    }

    async update(
        id: string,
        data: import('./dto/update-paiement.dto.js').UpdatePaiementDto,
    ): Promise<Paiement> {
        const paiement = await this.findOne(id);
        const { etudiantId, ...paiementData } = data;

        if (etudiantId) {
            const etudiant = await this.etudiantRepository.findOne({
                where: { id: etudiantId },
            });

            if (!etudiant) {
                throw new NotFoundException(
                    'Étudiant introuvable pour ce paiement',
                );
            }

            paiement.etudiant = etudiant;
        }

        Object.assign(paiement, paiementData);
        return this.paiementRepository.save(paiement);
    }

    async remove(id: string): Promise<{ message: string }> {
        const paiement = await this.paiementRepository.findOne({
            where: { id },
        });

        if (!paiement) {
            throw new NotFoundException(
                `Paiement avec l'ID ${id} non trouvé`,
            );
        }

        await this.paiementRepository.remove(paiement);

        return { message: 'Paiement supprimé avec succès.' };
    }
}
