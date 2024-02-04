import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { bcrypt } from '@common/utils';
import { Nullable, ServiceResponse } from '@shared/types';

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

  async create(createUserDto: CreateUserDto): Promise<ServiceResponse> {
    try {
      const password = await bcrypt.encrypt(createUserDto.password);
      const newUser = { ...createUserDto, password };
      await this.userRepository.save(newUser);
      return {
        message: 'user registered successful',
      };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      return {
        error: 'Unable to register user at the moment. Please try again later.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll(param: string): Promise<User[]> {
    return this.userRepository.find({
      where: [{ username: Like(`%${param}}`) }, { email: Like(`%${param}}`) }],
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ServiceResponse> {
    try {
      const updateUser = { ...updateUserDto };

      if (updateUser?.email) {
        const userOrError = await this.findByEmail(updateUserDto.email);
        if ('error' in userOrError) {
          return userOrError;
        }

        const user = userOrError as User;

        if (user.id !== id) {
          return {
            error: `Email ${updateUserDto.email} already exists.`,
            status: HttpStatus.CONFLICT,
          };
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
      return {
        error: 'Unable to update user at the moment. Please try again later.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findByEmail(email: string): Promise<ServiceResponse | User> {
    try {
      return this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      return {
        error: `User with email ${email} not found.`,
        status: HttpStatus.NOT_FOUND,
      };
    }
  }

  async findById(id: number): Promise<ServiceResponse | User> {
    try {
      return this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      return {
        error: `User with id ${id} not found.`,
        status: HttpStatus.NOT_FOUND,
      };
    }
  }

  async remove(id: number): Promise<ServiceResponse> {
    try {
      const userOrError = await this.findById(id);
      if ('error' in userOrError) {
        return userOrError;
      }

      const user = userOrError as User;

      await this.userRepository.softDelete(id);
      return {
        message: `user ${user.username} has been removed successfully`,
      };
    } catch (error) {
      this.logger.error(`Error removing user: ${error.message}`, error.stack);
      return {
        error: 'Unable to remove user at the moment. Please try again later.',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
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
