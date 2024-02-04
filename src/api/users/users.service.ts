import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { bcrypt } from '@common/utils';
import { Nullable } from '@shared/types';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<object> {
    try {
      const password = await bcrypt.encrypt(createUserDto.password);
      const newUser = { ...createUserDto, password };
      await this.userRepository.save(newUser);
      return {
        message: 'user registered successful',
      };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new Error(
        'Unable to register user at the moment. Please try again later.',
      );
    }
  }

  async findAll(param: string): Promise<User[]> {
    return this.userRepository.find({
      where: [{ username: Like(`%${param}}`) }, { email: Like(`%${param}}`) }],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<object> {
    try {
      const updateUser = { ...updateUserDto };

      if (updateUser?.email) {
        const user = await this.findByEmail(updateUserDto.email);
        if (user !== null && user.id !== id) {
          throw new ConflictException(
            `Email ${updateUserDto.email} already exists.`,
          );
        }
      }

      if (updateUser?.password) {
        updateUser.password = await bcrypt.encrypt(updateUserDto.password);
      }

      await this.userRepository.update(id, updateUserDto);
      return {
        message: `user updated`,
      };
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new Error(
        'Unable to update user at the moment. Please try again later.',
      );
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }
  }

  async findById(id: number): Promise<User> {
    try {
      return this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const user = await this.findById(id);
      await this.userRepository.softDelete(id);
      return {
        message: `user ${user.username} has been removed successfully`,
      };
    } catch (error) {
      this.logger.error(`Error removing user: ${error.message}`, error.stack);
      throw new Error(
        'Unable to remove user at the moment. Please try again later.',
      );
    }
  }

  async getUserWithPassword(email: string): Promise<Nullable<User>> {
    return this.userRepository
      .createQueryBuilder('users')
      .addSelect(['users.password'])
      .where('users.email = :email', { email })
      .getOne();
  }
}
