import { Module } from '@nestjs/common';
import { CitoyenAuthService } from './citoyen.auth.service';
import { CitoyenAuthController } from './citoyen.auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalCitoyenStrategy } from './local-citoyen.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtCitoyenStrategy } from './jwt-citoyen.strategy';
import { CitoyenModule } from 'src/citoyen/citoyen.module';

@Module({
  imports: [
    PassportModule,
    CitoyenModule,
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
  ],
  providers: [CitoyenAuthService, LocalCitoyenStrategy, JwtCitoyenStrategy],
  controllers: [CitoyenAuthController],
  exports: [CitoyenAuthService],
})
export class CitoyenAuthModule {}
