import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { User } from '@api/users/entities/user.entity';
import { UsersService } from '@api/users/users.service';

import { Auth } from './auth.entity';
import { AuthType } from './auth.type';
import { LoginDto } from './dto/login.dto';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthType> {
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

  async login(loginDto: LoginDto): Promise<AuthType> {
    const user = await this.usersService.findByEmail(loginDto.email);

    const validatePassword = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('Incorrect password.');
    }
    const lastAuth = await this.authRepository.findOneBy({ userId: user });
    if (lastAuth !== null) {
      await this.authRepository.softDelete(lastAuth.id);
    }
    const auth = await this.authRepository.save({ userId: user });

    const payload: PayloadDto = {
      email: user.email,
      tokenId: auth.id,
      userId: user.id,
    };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserWithPassword(email);

    return user && (await user.checkPassword(password)) ? user : null;
  }

  async findAuth(id: number): Promise<Auth> {
    return this.authRepository.findOneBy({ id });
  }
}
