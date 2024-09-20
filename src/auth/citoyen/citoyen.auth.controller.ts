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
import { CitoyenAuthService } from './citoyen.auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCitoyenDto } from '../../citoyen/dto/create-citoyen.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';

@ApiTags('Citoyen Authentification')
@Controller('citoyens/auth')
export class CitoyenAuthController {
  constructor(private citoyenAuthService: CitoyenAuthService) {}

  /**
   * Route de connexion pour les citoyens
   * Utilise la stratégie 'local-citoyen' pour valider les identifiants du citoyen
   */
  @UseGuards(AuthGuard('local-citoyen'))
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Connexion du citoyen' })
  @ApiBody({
    description: "Données d'authentification du citoyen",
    schema: { example: { phoneNumber: '+33123456789', password: 'somethingStrong ' } },
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Connexion réussie. Retourne les informations du citoyen et le token JWT.',
    schema: {
      example: {
        message: 'Login successful',
        result: {
          citoyen: {
            _id: '60b91c202123af20d8b2f1e4',
            phoneNumber: '+33123456789',
            name: 'Jean',
            surname: 'Dupont',
            birthDate: '1990-05-15T00:00:00.000Z',
            job: 'Ingénieur',
            sex: 'M',
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI...'
        }
      }
    }
  })
  @SwaggerApiResponse({ status: 401, description: 'Échec de la connexion : identifiants invalides.' })
  async login(@Request() req, @Res({ passthrough: true }) response): Promise<any> {
    const { citoyen, token } = await this.citoyenAuthService.login(req.user);
    response.cookie('token', token, {
      maxAge: 48 * 60 * 60 * 1000, // 48 heures
      httpOnly: true,
      signed: true,
    });

    return { message: 'Login successful', result: { citoyen } };
  }

  /**
   * Route d'inscription pour les citoyens
   * Crée un nouveau compte citoyen
   */
  @Post('signup')
  @ApiOperation({ summary: 'Inscription du citoyen' })
  @ApiBody({ description: "Données pour créer un compte citoyen", type: CreateCitoyenDto })
  @SwaggerApiResponse({
    status: 201,
    description: 'Citoyen créé avec succès. Retourne les informations du citoyen et le token JWT.',
    schema: {
      example: {
        message: 'Citoyen created',
        result: {
          citoyen: {
            _id: '60b91c202123af20d8b2f1e4',
            phoneNumber: '+33123456789',
            name: 'Jean',
            surname: 'Dupont',
            birthDate: '1990-05-15T00:00:00.000Z',
            job: 'Ingénieur',
            sex: 'M',
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI...'
        }
      }
    }
  })
  @SwaggerApiResponse({ status: 409, description: 'Échec de la création : le numéro de téléphone existe déjà.' })
  @SwaggerApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  async signUp(@Body() body: CreateCitoyenDto): Promise<any> {
    const citoyen = await this.citoyenAuthService.create(body);
    return { message: 'Citoyen created', result: citoyen };
  }

  /**
   * Route de déconnexion pour les citoyens
   * Supprime le cookie contenant le token JWT
   */
  @UseGuards(AuthGuard('jwt-citoyen'))
  @Get('logout')
  @ApiOperation({ summary: 'Déconnexion du citoyen' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Déconnexion réussie. Le cookie contenant le token JWT a été supprimé.',
    schema: {
      example: {
        message: 'Logout successful'
      }
    }
  })
  async logout(@Request() req, @Res({ passthrough: true }) response): Promise<any> {
    response.clearCookie('token');
    return { message: 'Logout successful' };
  }
}
