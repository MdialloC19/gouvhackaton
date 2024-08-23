import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comptes } from '../../interfaces/comptes.interface';
import { CreateCompteDto } from '../../dto/create-compte.dto';
import { UpdateCompteDto } from '../../dto/update-compte.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
@Injectable()
export class ComptesService {
    constructor(
        @InjectModel('Compte') private readonly comptesModel: Model<Comptes>,
    ) {}

    async createCompte(createCompteDto: CreateCompteDto): Promise<Comptes> {
        const existingCompte = await this.comptesModel.findOne({
            $or: [
                { userId: createCompteDto.userId },
                { idCardNumber: createCompteDto.idCardNumber },
            ],
        });

        if (existingCompte) {
            throw new HttpException(
                "Un compte existe déjà pour cet utilisateur ou ce numéro de carte d'identité.",
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashedPassword = await bcrypt.hash(createCompteDto.password, 10);
        createCompteDto.password = hashedPassword;

        const compte = new this.comptesModel(createCompteDto);
        if (!compte) {
            throw new HttpException(
                'Impossible de créer un compte pour cet utilisateur',
                HttpStatus.BAD_REQUEST,
            );
        }
        return compte.save();
    }

    async updateCompte(
        compteId: string,
        updateCompteDto: UpdateCompteDto,
    ): Promise<Comptes> {
        if (updateCompteDto.password) {
            updateCompteDto.password = await bcrypt.hash(
                updateCompteDto.password,
                10,
            );
        }

        const compte = await this.comptesModel.findByIdAndUpdate(
            compteId,
            updateCompteDto,
            { new: true },
        );
        if (!compte) {
            throw new HttpException(
                'Compte introuvable.',
                HttpStatus.NOT_FOUND,
            );
        }
        return compte;
    }

    async deleteCompte(compteId: string): Promise<Comptes> {
        const compte = await this.comptesModel.findByIdAndUpdate(
            compteId,
            { isDeleted: true },
            { new: true },
        );
        if (!compte) {
            throw new HttpException(
                'Compte introuvable.',
                HttpStatus.NOT_FOUND,
            );
        }
        return compte;
    }

    async getCompteByUserId(userId: string): Promise<Comptes> {
        const compte = await this.comptesModel.findOne({ userId });
        if (!compte) {
            throw new HttpException(
                'Compte introuvable.',
                HttpStatus.NOT_FOUND,
            );
        }
        return compte;
    }

    async getCompteById(compteId: string): Promise<Comptes> {
        const compte = await this.comptesModel.findById(compteId);
        if (!compte) {
            throw new HttpException(
                'Compte introuvable.',
                HttpStatus.NOT_FOUND,
            );
        }
        return compte;
    }

    async getCompteByIdCardNumber(idCardNumber: number): Promise<Comptes> {
        const compte = await this.comptesModel.findOne({ idCardNumber });
        if (!compte) {
            throw new HttpException(
                "Compte introuvable pour ce numéro de carte d'identité.",
                HttpStatus.NOT_FOUND,
            );
        }
        return compte;
    }

    async getAllComptes(): Promise<Comptes[]> {
        const comptes = await this.comptesModel.find();
        if (!comptes.length) {
            throw new HttpException(
                'Aucun compte trouvé.',
                HttpStatus.NOT_FOUND,
            );
        }
        return comptes;
    }

    async validatePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Génère un OTP (One-Time Password) aléatoire.
     * @returns {string} - OTP généré.
     */
    generateOtp(): string {
        return crypto.randomInt(1000, 9999).toString();
    }

    async hashSecret(secret) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(secret, salt);
    }
}
