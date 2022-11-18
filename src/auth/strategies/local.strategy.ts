
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
        usernameField: 'email',
        passwordField: 'firebaseId'
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(password, email);
    if (!user) {
    throw new UnauthorizedException();
    }
    return user;
  }
}