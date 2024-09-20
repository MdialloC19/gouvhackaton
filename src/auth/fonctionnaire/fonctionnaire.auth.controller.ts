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
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

@ApiTags('Fonctionnaire Authentification') // Tag Swagger pour regrouper les routes d'authentification des fonctionnaires
@Controller('fonctionnaires/auth')
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
  @ApiOperation({ summary: 'Connexion des fonctionnaires' })
  @ApiBody({
    description: "Données d'authentification pour la connexion",
    schema: { example: { email: 'jean.dupont@example.com', password: '' } },
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Connexion réussie. Retourne les informations du fonctionnaire et le token JWT.',
    schema: {
      example: {
        message: 'Login successful',
        result: {
          fonctionnaire: {
            _id: '60b91c202123af20d8b2f1e4',
            email: 'jean.dupont@example.com',
            name: 'Jean',
            surname: 'Dupont',
            job: 'Ingénieur',
            role: 'Admin',
          },
          token: '',
        },
      },
    },
  })
  @SwaggerApiResponse({ status: 401, description: 'Identifiants invalides.' })
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
  @ApiOperation({ summary: 'Inscription des fonctionnaires' })
  @ApiBody({ type: CreateFonctionnaireDto, description: 'Données pour créer un nouveau fonctionnaire' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Fonctionnaire créé avec succès. Retourne les informations du fonctionnaire et le token JWT.',
    schema: {
      example: {
        message: 'Fonctionnaire created',
        result: {
          fonctionnaire: {
            _id: '60b91c202123af20d8b2f1e4',
            email: 'jean.dupont@example.com',
            name: 'Jean',
            surname: 'Dupont',
            job: 'Ingénieur',
            role: 'Admin',
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjkxYzIwMjEyM2FmMjBkOGIyZjFlNCIsImlhdCI6MTYyMTk2MzMyMn0.SZnwxnrc8j-FK2OcVROCeKEdHfbxxQJfZ5sEnYcwkS4',
        },
      },
    },
  })
  @SwaggerApiResponse({ status: 409, description: 'Le fonctionnaire avec cet email existe déjà.' })
  @SwaggerApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
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
  @ApiOperation({ summary: 'Déconnexion des fonctionnaires' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Déconnexion réussie. Le cookie contenant le token JWT a été supprimé.',
    schema: {
      example: {
        message: 'Logout successful',
      },
    },
  })
  async logout(@Request() req, @Res({ passthrough: true }) response): Promise<any> {
    response.clearCookie('token');
    return { message: 'Logout successful' };
  }
}
