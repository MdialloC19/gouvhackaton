import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FonctionnaireService } from '../../fonctionnaire/fonctionnaire.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly fonctionnaireService: FonctionnaireService) {
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) return null;
        return req.signedCookies['token'];
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    });
  }

  /**
   * Valide le token JWT en vérifiant l'existence du fonctionnaire dans la base de données
   * @param {any} payload - Les informations extraites du token JWT
   * @returns {Promise<any>} - Le fonctionnaire correspondant ou une exception UnauthorizedException
   */
  
  async validate(payload: any): Promise<any> {
    const fonctionnaire = await this.fonctionnaireService.findOne(payload.id);
    if (!fonctionnaire) {
      throw new UnauthorizedException('Invalid token: Fonctionnaire not found');
    }
    return fonctionnaire;
  }
}
