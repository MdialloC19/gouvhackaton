import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CitoyenService } from '../../citoyen/citoyen.service';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Citoyen Authentification - Stratégie JWT') // Tag Swagger pour la stratégie JWT
@Injectable()
export class JwtCitoyenStrategy extends PassportStrategy(Strategy, 'jwt-citoyen') {
  constructor(private readonly citoyenService: CitoyenService) {
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) return null;
        return req.signedCookies['token'];
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY, // Clé secrète pour vérifier le JWT
    });
  }

  /**
   * Valide le token JWT en vérifiant l'existence du citoyen dans la base de données
   * @param {any} payload - Les informations extraites du token JWT
   * @returns {Promise<any>} - Le citoyen correspondant ou une exception UnauthorizedException
   */
  @ApiOperation({ summary: 'Valider un citoyen avec JWT' })
  @ApiBearerAuth() // Indique que l'authentification JWT est nécessaire
  @SwaggerApiResponse({
    status: 200,
    description: 'Token JWT validé avec succès. Le citoyen est authentifié.',
    schema: {
      example: {
        _id: '60b91c202123af20d8b2f1e4',
        phoneNumber: '+33123456789',
        name: 'Jean',
        surname: 'Dupont',
        birthDate: '1990-05-15T00:00:00.000Z',
        job: 'Ingénieur',
        sex: 'M',
      },
    },
  })
  @SwaggerApiResponse({ status: 401, description: 'Token JWT invalide ou citoyen non trouvé.' })
  async validate(payload: any): Promise<any> {
    const citoyen = await this.citoyenService.findOne(payload.id);
    if (!citoyen) {
      throw new UnauthorizedException('Invalid token: Citoyen not found');
    }
    return citoyen;
  }
}
