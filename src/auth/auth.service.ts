import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  login(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, this.configService.get('JWT_SECRET'), {
      expiresIn: '30m',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(
        jwtString,
        this.configService.get('JWT_SECRET'),
      ) as (jwt.JwtPayload | string) & User;

      const { id, email } = payload;

      return {
        userId: id,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
