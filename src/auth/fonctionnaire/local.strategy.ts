import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FonctionnaireAuthService } from './fonctionnaire.auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly fonctionnaireAuthService: FonctionnaireAuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Valide les informations d'authentification d'un fonctionnaire
   * @param {string} email - L'email du fonctionnaire
   * @param {string} password - Le mot de passe du fonctionnaire
   * @returns {Promise<any>} - Le fonctionnaire authentifié ou une exception UnauthorizedException
   */
  async validate(email: string, password: string): Promise<any> {
    console.log("email", email);
    console.log("password", password);
    const fonctionnaire = await this.fonctionnaireAuthService.validateFonctionnaire(email, password);

    if (!fonctionnaire) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return fonctionnaire;
  }
}
