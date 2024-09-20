import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CitoyenService } from '../../citoyen/citoyen.service';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiBearerAuth } from '@nestjs/swagger';


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

  

  async validate(payload: any): Promise<any> {
    const citoyen = await this.citoyenService.findOne(payload.id);
    if (!citoyen) {
      throw new UnauthorizedException('Invalid token: Citoyen not found');
    }
    return citoyen;
  }
}
