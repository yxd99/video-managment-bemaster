import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from '@api/auth/dto/login.dto';
import { PayloadDto } from '@api/auth/dto/payload.dto';
import { CreateUserDto } from '@api/users/dto/create-user.dto';
import { UsersService } from '@api/users/users.service';
import { bcrypt } from '@common/utils';
import { ResponseHttp } from '@shared/interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<ResponseHttp> {
    const user = await this.usersService.findByEmail(createUserDto.email);

    if (user !== null) {
      throw new ConflictException(`email ${user.email} already exist`);
    }

    await this.usersService.create(createUserDto);

    const { token } = await this.login({
      email: createUserDto.email,
      password: createUserDto.password,
    });

    return {
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<ResponseHttp> {
    const user = await this.usersService.getUserWithPassword(loginDto.email);
    if (user === null) {
      return {
        error: 'unregistered user',
      };
    }

    const validatePassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!validatePassword) {
      return {
        error: 'incorrect password',
      };
    }
    const payload: PayloadDto = {
      userId: user.id,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    return user?.checkPassword(password) ? user : null;
  }
}
