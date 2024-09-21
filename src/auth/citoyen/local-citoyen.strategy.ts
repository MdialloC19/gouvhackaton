import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CitoyenAuthService } from './citoyen.auth.service';



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

  async validate(phoneNumber: string, password: string): Promise<any> {
    const citoyen = await this.citoyenAuthService.validateCitoyen(phoneNumber, password);

    if (!citoyen) {
      throw new UnauthorizedException('Invalid phone number or password');
    }
 
    return citoyen;
  }
}
