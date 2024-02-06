import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AuthService } from '@api/auth/auth.service';
import { PayloadDto } from '@api/auth/dto/payload.dto';
import { publicData } from '@common/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      publicData.PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (isPublic && !token) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('');
    }

    const payload: PayloadDto = await this.jwtService
      .verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
    const authId = await this.authService.findAuth(payload.tokenId);
    if (authId === null) {
      throw new UnauthorizedException('token invalid');
    }

    request.user = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
