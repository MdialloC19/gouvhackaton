import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UsePipes,
    ValidationPipe,
    HttpException,
    HttpStatus,
    Put,
    HttpCode,
} from '@nestjs/common';
import { ComptesService } from '../../services/comptes/comptes.service';
import { CreateCompteDto } from '../../dto/create-compte.dto';
import { UpdateCompteDto } from '../../dto/update-compte.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { loginCompteDto } from 'src/comptes/dto/login-compte.dto';
import { VerifyOtpDto } from 'src/comptes/dto/verify-otp.dto';
import { SmsService } from 'src/utils/sms/services/sms/sms.service';
import { MongoServerError } from 'mongodb';
import { Schema } from 'mongoose';

@Controller('comptes')
export class ComptesController {
    constructor(
        private readonly comptesService: ComptesService,
        private readonly usersService: UsersService,
        private readonly smsService: SmsService,
    ) {}

    @Post('register')
    @UsePipes(new ValidationPipe())
    async createUserCompte(@Body() createUserDto: CreateUserDto) {
        try {
            const user = await this.usersService.createUser(createUserDto);
            if (!user) {
                throw new HttpException(
                    'Impossible de créer un compte pour cet utilisateur',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const secretOtp = await this.comptesService.generateOtp();
            const hashedOtp = await this.comptesService.hashSecret(secretOtp);

            const castNumber = '+221' + createUserDto.number;

            const sendSMS = await this.smsService.sendSMSAndSave(secretOtp, [
                castNumber,
            ]);

            if (!sendSMS) {
                throw new HttpException(
                    "Impossible d'envoyer le SMS de vérification",
                    HttpStatus.BAD_REQUEST,
                );
            }

            const compte = await this.createCompte({
                userId: user._id as string,
                idCardNumber: createUserDto.idCardNumber,
                password: createUserDto.password,
                otp: hashedOtp,
            });

            if (!compte) {
                throw new HttpException(
                    'Impossible de créer un compte pour cet utilisateur',
                    HttpStatus.BAD_REQUEST,
                );
            }

            return {
                success: true,
                message: 'Compte créé avec succès',
                data: compte,
            };
        } catch (error) {
            console.log(error);
            return this.handleError(error);
        }
    }
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UsePipes(new ValidationPipe())
    async loginCompte(@Body() loginCompteDto: loginCompteDto) {
        try {
            const compte = await this.comptesService.getCompteByIdCardNumber(
                loginCompteDto.idCardNumber,
            );

            if (!compte) {
                throw new HttpException(
                    'Compte introuvable pour cet utilisateur',
                    HttpStatus.NOT_FOUND,
                );
            }

            const isPasswordValid = await this.comptesService.validatePassword(
                loginCompteDto.password,
                compte.password,
            );

            if (!isPasswordValid) {
                throw new HttpException(
                    'Mot de passe incorrect',
                    HttpStatus.BAD_REQUEST,
                );
            }

            //JWT token generation can be added here if needed, after i will do it

            return {
                success: true,
                message: 'Connexion réussie',
                data: compte,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }
    @Post('verify-otp')
    @UsePipes(new ValidationPipe())
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        try {
            const compte = await this.comptesService.getCompteByIdCardNumber(
                verifyOtpDto.idCardNumber,
            );

            if (!compte) {
                throw new HttpException(
                    'Compte introuvable pour cet utilisateur',
                    HttpStatus.NOT_FOUND,
                );
            }

            const isOtpValid = await this.comptesService.validatePassword(
                verifyOtpDto.otp,
                compte.otp,
            );

            if (!isOtpValid) {
                throw new HttpException(
                    'OTP incorrect',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const updatedCompte = await this.comptesService.updateCompte(
                compte._id,
                {
                    isConfirmed: true,
                },
            );

            return {
                success: true,
                message: 'OTP vérifié avec succès, compte confirmé',
                data: updatedCompte,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Get()
    async getAllComptes() {
        try {
            const comptes = await this.comptesService.getAllComptes();
            return {
                success: true,
                message: 'Liste des comptes récupérée avec succès',
                data: comptes,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Get(':id')
    async getCompteById(@Param('id') id: Schema.Types.ObjectId) {
        try {
            const compte = await this.comptesService.getCompteById(id);
            return {
                success: true,
                message: 'Compte récupéré avec succès',
                data: compte,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Get('user/:userId')
    async getCompteByUserId(@Param('userId') userId: Schema.Types.ObjectId) {
        try {
            const compte = await this.comptesService.getCompteByUserId(userId);
            return {
                success: true,
                message: "Compte récupéré avec succès pour l'utilisateur",
                data: compte,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Get('idCardNumber/:idCardNumber')
    async getCompteByIdCardNumber(@Param('idCardNumber') idCardNumber: number) {
        try {
            const compte =
                await this.comptesService.getCompteByIdCardNumber(idCardNumber);
            return {
                success: true,
                message:
                    "Compte récupéré avec succès pour ce numéro de carte d'identité",
                data: compte,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Put('change-password/:userId')
    async changePassword(
        @Body()
        body: {
            oldPassword: string;
            newPassword: string;
        },
        @Param('userId') userId: Schema.Types.ObjectId,
    ) {
        try {
            const { oldPassword, newPassword } = body;

            if (!userId || !oldPassword || !newPassword) {
                throw new HttpException(
                    'Veuillez fournir tous les champs requis.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const result = await this.comptesService.changePassword(
                userId,
                oldPassword,
                newPassword,
            );
            return {
                success: true,
                message: 'Mot de passe changé avec succès',
                data: result,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Put('reset-password')
    async resetPassword(
        @Body() body: { newPassword: string },
        @Param('userId') userId: Schema.Types.ObjectId,
    ) {
        try {
            const { newPassword } = body;

            if (!userId || !newPassword) {
                throw new HttpException(
                    'Veuillez fournir tous les champs requis.',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const result = await this.comptesService.resetPassword(
                userId,
                newPassword,
            );
            return {
                success: true,
                message: 'Mot de passe réinitialisé avec succès',
                data: result,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }
    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateCompte(
        @Param('id') id: Schema.Types.ObjectId,
        @Body() updateCompteDto: UpdateCompteDto,
    ) {
        try {
            const updatedCompte = await this.comptesService.updateCompte(
                id,
                updateCompteDto,
            );
            return {
                success: true,
                message: 'Compte mis à jour avec succès',
                data: updatedCompte,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    @Delete(':id')
    async deleteCompte(@Param('id') id: Schema.Types.ObjectId) {
        try {
            const deletedCompte = await this.comptesService.deleteCompte(id);
            return {
                success: true,
                message: 'Compte supprimé avec succès',
                data: deletedCompte,
            };
        } catch (error) {
            return this.handleError(error);
        }
    }
    async createCompte(createCompteDto: CreateCompteDto) {
        try {
            const compte =
                await this.comptesService.createCompte(createCompteDto);
            console.log('creer compte', compte);
            return compte;
        } catch (error) {
            console.log(error);
            return this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error instanceof HttpException) {
            return {
                success: false,
                message: error.message,
                statusCode: error.getStatus(),
            };
        } else if (error instanceof MongoServerError) {
            switch (error.code) {
                case 11000:
                    const duplicateField = Object.keys(error.keyValue)[0];
                    return {
                        success: false,
                        message: `Un utilisateur avec ce ${duplicateField} existe déjà.`,
                        statusCode: HttpStatus.BAD_REQUEST,
                    };
                case 121:
                    return {
                        success: false,
                        message: `Échec de la validation du document: ${error.errmsg}`,
                        statusCode: HttpStatus.BAD_REQUEST,
                    };
                default:
                    return {
                        success: false,
                        message: `Erreur MongoDB: ${error.message}`,
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    };
            }
        } else {
            return {
                success: false,
                message: 'Erreur interne du serveur',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
