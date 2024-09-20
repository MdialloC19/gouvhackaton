import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CitoyenService } from '../../citoyen/citoyen.service';

@Injectable()
export class JwtCitoyenStrategy extends PassportStrategy(Strategy, 'jwt-citoyen') {
  constructor(private readonly citoyenService: CitoyenService) {
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
   * Valide le token JWT en vérifiant l'existence du citoyen dans la base de données
   */
  async validate(payload: any): Promise<any> {
    const citoyen = await this.citoyenService.findOne(payload.id);
    if (!citoyen) {
      throw new UnauthorizedException('Invalid token: Citoyen not found');
    }
    return citoyen;
  }
}
