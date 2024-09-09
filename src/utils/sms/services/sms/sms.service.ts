import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sms } from '../../interfaces/sms.interface'; // Assurez-vous de définir une interface pour Sms
import { User } from '../../../../users/interfaces/users.interface'; // Assurez-vous de définir une interface pour User
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
    constructor(
        @InjectModel('Sms') private readonly smsModel: Model<Sms>,
        @InjectModel('User') private readonly userModel: Model<User>,
        private readonly configService: ConfigService,
    ) {}

    /**
     * Envoie un SMS via l'API IntechSMS et enregistre le SMS dans la base de données.
     * @param {string} content - Le contenu du SMS.
     * @param {string[]} msisdns - Les numéros de téléphone des destinataires du SMS.
     * @returns {Promise<boolean>} - Une promesse résolue indiquant si le SMS a été envoyé et enregistré avec succès.
     * @throws {HttpException} - Lance une erreur si l'envoi du SMS ou l'enregistrement dans la base de données échoue.
     */
    async sendSMSAndSave(content: string, msisdns: string[]): Promise<boolean> {
        try {
            const url = this.configService.get<string>('urlAPISMS');
            const contentParsed = this.sendSmsOPT(content);
            const payload = {
                app_key: this.configService.get<string>('INTECHSMS_API_KEY'),
                sender: this.configService.get<string>('SENDER'),
                content: contentParsed,
                msisdn: msisdns,
            };

            const response = await axios.post(url, payload);

            if (response.status === 200) {
                const newSMS = new this.smsModel({
                    intitule: 'SMS sortant',
                    contenu: content,
                    idReceiver: msisdns,
                });
                await newSMS.save();
                return true;
            } else {
                throw new HttpException(
                    "Erreur lors de l'envoi du SMS via l'API IntechSMS",
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Vérifie les numéros de téléphone des destinataires et récupère leurs ID utilisateurs.
     * @param {string[]} msisdns - Les numéros de téléphone des destinataires.
     * @returns {Promise<string[]>} - Une promesse résolue avec les ID des destinataires.
     * @throws {HttpException} - Lance une erreur si un numéro de téléphone n'est pas associé à un utilisateur.
     */
    async getReceiverIDs(msisdns: string[]): Promise<string[]> {
        try {
            const receiverIDs = [];
            for (const msisdn of msisdns) {
                const user = await this.userModel.findOne({ number: msisdn });
                if (user) {
                    receiverIDs.push(user._id);
                } else {
                    throw new HttpException(
                        `Utilisateur avec le numéro de téléphone ${msisdn} non trouvé`,
                        HttpStatus.NOT_FOUND,
                    );
                }
            }
            return receiverIDs;
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    sendSmsOPT(otp): string {
        return `Bienvenue sur Sama Kayiit, voici votre code de confirmation ${otp}`;
    }
}
