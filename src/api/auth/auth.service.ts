import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { User } from '@api/users/entities/user.entity';
import { UsersService } from '@api/users/users.service';
import { ServiceResponse } from '@shared/types';

import { Auth } from './auth.type';
import { LoginDto } from './dto/login.dto';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<Auth | ServiceResponse> {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException(
        `Email ${createUserDto.email} already exists.`,
      );
    }

    await this.usersService.create(createUserDto);

    return this.login({
      email: createUserDto.email,
      password: createUserDto.password,
    });
  }

  async login(loginDto: LoginDto): Promise<Auth> {
    const user = await this.usersService.findByEmail(loginDto.email);

    const validatePassword = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('Incorrect password.');
    }

    const payload: PayloadDto = {
      userId: user.id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserWithPassword(email);

    return user && (await user.checkPassword(password)) ? user : null;
  }
}
