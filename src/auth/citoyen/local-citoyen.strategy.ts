import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CitoyenAuthService } from './citoyen.auth.service';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Citoyen Authentification - Stratégie Locale') 
@Injectable()
export class LocalCitoyenStrategy extends PassportStrategy(Strategy, 'local-citoyen') {
  constructor(private readonly citoyenAuthService: CitoyenAuthService) {
    super({ usernameField: 'phoneNumber' }); // Utilise phoneNumber pour l'identification
  }

  /**
   * Valide les informations d'authentification d'un citoyen avec phoneNumber et mot de passe
   * @param {string} phoneNumber - Le numéro de téléphone du citoyen
   * @param {string} password - Le mot de passe du citoyen
   * @returns {Promise<any>} - Le citoyen authentifié ou une exception UnauthorizedException
   */
  @ApiOperation({ summary: 'Valider un citoyen par numéro de téléphone et mot de passe' })
  @ApiBody({
    description: "Données d'identification pour la stratégie locale",
    schema: { example: { phoneNumber: '+33123456789', password: 'Str0ngP@ssw0rd!' } },
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Authentification réussie.',
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
  @SwaggerApiResponse({ status: 401, description: 'Échec de l\'authentification : identifiants invalides.' })
  async validate(phoneNumber: string, password: string): Promise<any> {
    const citoyen = await this.citoyenAuthService.validateCitoyen(phoneNumber, password);

    if (!citoyen) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    return citoyen;
  }
}
