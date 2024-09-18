import { Module } from '@nestjs/common';
import { FonctionnaireAuthService } from './fonctionnaire.auth.service';
import { FonctionnaireAuthController } from './fonctionnaire.auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { FonctionnaireModule } from 'src/fonctionnaire/fonctionnaire.module';

@Module({
  imports: [
    PassportModule,
    FonctionnaireModule, 
    JwtModule.register({
      secret: process.env.JWTKEY, 
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION }, 
    }),
  ],
  providers: [FonctionnaireAuthService, LocalStrategy, JwtStrategy], 
  controllers: [FonctionnaireAuthController], 
  exports:[FonctionnaireAuthService]
})
export class FonctionnaireAuthModule {}
