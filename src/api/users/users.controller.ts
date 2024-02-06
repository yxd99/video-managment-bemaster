import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PayloadDto } from '@api/auth/dto/payload.dto';
import { Payload } from '@shared/decorators/payload.decorator';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  async update(
    @Payload() payload: PayloadDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(payload.userId, updateUserDto);
  }

  @Delete()
  async remove(@Payload() payload: PayloadDto) {
    return this.usersService.remove(payload.userId);
  }

  @Get('videos')
  async getVideosUser(@Payload() payload: PayloadDto) {
    return this.usersService.getVideosUser(payload.userId);
  }

  @Get()
  async profile(@Payload() payload: PayloadDto) {
    return this.usersService.findById(payload.userId);
  }
}
