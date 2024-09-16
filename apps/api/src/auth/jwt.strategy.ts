import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserWithoutPassword } from '~libs/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<UserWithoutPassword> {
    const token = req.headers['authorization']!.split('Bearer ')[1];
    const user = await this.authService.validate(token);
    req.User = user;
    req.token = token;
    return user;
  }
}
