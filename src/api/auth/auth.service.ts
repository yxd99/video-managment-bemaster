import { Injectable, HttpStatus } from '@nestjs/common';
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
    try {
      const existingUser = await this.usersService.findByEmail(
        createUserDto.email,
      );

      if (!('error' in existingUser)) {
        return {
          error: `Email ${createUserDto.email} already exists.`,
          statusCode: HttpStatus.CONFLICT,
        };
      }

      await this.usersService.create(createUserDto);

      const login = await this.login({
        email: createUserDto.email,
        password: createUserDto.password,
      });
      if ('error' in login) {
        throw login;
      }
      return login as Auth;
    } catch (error) {
      return {
        error: 'Unable to register user at the moment. Please try again later.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async login(loginDto: LoginDto): Promise<Auth | ServiceResponse> {
    try {
      const findUser = await this.usersService.findByEmail(loginDto.email);

      if ('error' in findUser) {
        return {
          error: 'Unregistered user.',
          statusCode: HttpStatus.UNAUTHORIZED,
        };
      }
      const user = findUser as User;

      const validatePassword = await this.validateUser(
        loginDto.email,
        loginDto.password,
      );

      if (!validatePassword) {
        return {
          error: 'Incorrect password.',
          statusCode: HttpStatus.UNAUTHORIZED,
        };
      }

      const payload: PayloadDto = {
        userId: user.id,
        email: user.email,
      };
      const token = await this.jwtService.signAsync(payload);

      return { token };
    } catch (error) {
      return {
        error: 'Unable to perform login at the moment. Please try again later.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = (await this.usersService.findByEmail(email)) as User;
      return (await user?.checkPassword(password)) ? user : null;
    } catch (error) {
      return error;
    }
  }
}
