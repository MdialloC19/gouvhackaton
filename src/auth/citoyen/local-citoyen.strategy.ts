import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CitoyenAuthService } from './citoyen.auth.service';

@Injectable()
export class LocalCitoyenStrategy extends PassportStrategy(Strategy, 'local-citoyen') {
  constructor(private readonly citoyenAuthService: CitoyenAuthService) {
    super({ usernameField: 'phoneNumber' }); // Maintennant on use phoneNUmber comme identifiant comme identifiant
  }

  async validate(phoneNumber: string, password: string): Promise<any> {
    const citoyen = await this.citoyenAuthService.validateCitoyen(phoneNumber, password);

    if (!citoyen) {
      throw new UnauthorizedException('Invalid CNI or password');
    }

    return citoyen;
  }
}
