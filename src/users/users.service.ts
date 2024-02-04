import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { bcrypt } from '@root/utils';
import { Nullable } from '@shared/types';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<object> {
    createUserDto.password = await bcrypt.encrypt(createUserDto.password);
    await this.userRepository.save(createUserDto);
    return {
      message: 'user registered succesful',
    };
  }

  async findAll(param: string): Promise<User[]> {
    return await this.userRepository.find({
      where: [{ username: Like(`%${param}}`) }, { email: Like(`%${param}}`) }],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<object> {
    if (updateUserDto?.email) {
      const user = await this.findByEmail(updateUserDto.email);
      if (user !== null) {
        return {
          message: `email ${updateUserDto.email} already exist.`,
        };
      }
    }

    if (updateUserDto?.password) {
      updateUserDto.password = await bcrypt.encrypt(updateUserDto.password);
    }

    await this.userRepository.update(id, updateUserDto);
    return {
      message: `user updated`,
    };
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<object> {
    const user = await this.userRepository.findOneBy({ id });
    if (user !== null) {
      return { message: 'User not exist' };
    }
    await this.userRepository.softDelete(user.id);
    return {
      message: `user ${user.username} has been remove successful`,
    };
  }

  async getUserWithPassword(email: string): Promise<Nullable<User>> {
    return await this.userRepository
      .createQueryBuilder('users')
      .addSelect(['users.password'])
      .where('users.email = :email', { email })
      .getOne();
  }
}
