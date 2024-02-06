import {
  Injectable,
  Logger,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { VideosService } from '@api/videos/videos.service';
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
    private readonly videosService: VideosService,
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
      this.logger.error(`Error creating user: ${error}`);
      throw new InternalServerErrorException(error);
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
        const user = await this.findByEmail(updateUserDto.email);

        if (user !== null) {
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
      this.logger.error(`Error updating user: ${error}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return this.userRepository.findOneBy({ email });
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error}`);
      throw error;
    }
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneByOrFail({ id });
  }

  async remove(id: number): Promise<ServiceResponse> {
    try {
      const user = await this.userRepository.findOne({
        relations: ['videos'],
        where: { id },
      });

      const { videos } = user;

      videos.forEach(async (video) => {
        await this.videosService.remove(video.id, id);
      });

      await this.userRepository.softDelete(id);
      return {
        message: `user ${user.username} has been removed successfully`,
      };
    } catch (error) {
      this.logger.error(`Error removing user: ${error}`);
      throw error;
    }
  }

  async getUserWithPassword(email: string): Promise<Nullable<User>> {
    try {
      return this.userRepository
        .createQueryBuilder('users')
        .addSelect(['users.password'])
        .where('users.email = :email', { email })
        .getOne();
    } catch (error) {
      this.logger.error(`Error get user with password: ${error}`);
      throw error;
    }
  }

  async getVideosUser(id: number): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('users')
      .leftJoin('users.videos', 'video')
      .select(['video'])
      .where('users.id = :id', { id })
      .getRawMany();
  }
}
