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
  async logout(@Request() req, @Res({ passthrough: true }) response): Promise<any> {
    response.clearCookie('token');
    return { message: 'Logout successful' };
  }
}
