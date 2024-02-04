import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@api/auth/auth.service';
import { User } from '@api/users/entities/user.entity';
import { ServiceResponse } from '@shared/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const result: ServiceResponse | User = await this.authService.validateUser(
      email,
      password,
    );

    if ('error' in result) {
      throw result;
    }

    return result;
  }
}
