import {
  Controller,
  UseGuards,
  Post,
  Body,
  Request,
  Res,
  Get,
  HttpCode,
} from '@nestjs/common';
import { FonctionnaireAuthService } from './fonctionnaire.auth.service';

import { AuthGuard } from '@nestjs/passport';
import { CreateFonctionnaireDto } from '../../fonctionnaire/dto/create-fonctionnaire.dto';

@Controller('fonctionnaire/auth')
export class FonctionnaireAuthController {
  constructor(private fonctionnaireAuthService: FonctionnaireAuthService) {}

  /**
   * Route de connexion pour les fonctionnaires
   * Utilise la stratégie 'local' pour valider les identifiants du fonctionnaire
   * @param {Request} req - La requête contenant les données du fonctionnaire
   * @param {Response} response - La réponse pour définir les cookies
   * @returns {Promise<any>} - Les informations de connexion avec le token JWT
   */
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response): Promise<any> {
    const { fonctionnaire, token } = await this.fonctionnaireAuthService.login(req.user);
    response.cookie('token', token, {
      maxAge: 48 * 60 * 60 * 1000, // 48 heures
      httpOnly: true,
      signed: true,
    });

    return { message: 'Login successful', result: { fonctionnaire } };
  }

  /**
   * Route d'inscription pour les fonctionnaires
   * Crée un nouveau compte fonctionnaire
   * @param {CreateFonctionnaireDto} body - Les données pour créer un fonctionnaire
   * @returns {Promise<any>} - Les informations du fonctionnaire créé avec le token JWT
   */
  @Post('signup')
  async signUp(@Body() body: CreateFonctionnaireDto): Promise<any> {
    const fonctionnaire = await this.fonctionnaireAuthService.create(body);
    return { message: 'Fonctionnaire created', result: fonctionnaire };
  }

  /**
   * Route de déconnexion pour les fonctionnaires
   * Supprime le cookie contenant le token JWT
   * @param {Request} req - La requête du fonctionnaire
   * @param {Response} response - La réponse pour effacer les cookies
   * @returns {Promise<any>} - Confirmation de la déconnexion
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(@Request() req, @Res({ passthrough: true }) response): Promise<any> {
    response.clearCookie('token');
    return { message: 'Logout successful' };
  }
}
