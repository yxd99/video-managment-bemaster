import { NotFoundException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

import { payloadMock, userMock } from '@common/mocks';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockRepository: object = {
    save: jest.fn(() => userMock),
    create: jest.fn(),
    find: jest.fn(() => []),
    findOneBy: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };
  const tokenRepository = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: tokenRepository, useValue: mockRepository },
      ],
    })
      .useMocker((token) => {
        const mockMetadata = moduleMocker.getMetadata(
          token,
        ) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'test',
      };

      jest.spyOn(service, 'update').mockResolvedValueOnce({
        message: '',
      });

      const result = await controller.update(payloadMock, updateUserDto);

      expect(result).toEqual({
        message: '',
      });
    });

    it('should handle errors during user update', async () => {
      const updateUserDto: UpdateUserDto = {
        password: '123',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.update(payloadMock, updateUserDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce({
        message: '',
      });

      const result = await controller.remove(payloadMock);

      expect(result).toEqual({
        message: '',
      });
    });

    it('should handle errors during user removal', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(controller.remove(payloadMock)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getVideosUser', () => {
    it('should get videos for a user', async () => {
      jest.spyOn(service, 'getVideosUser').mockResolvedValueOnce([userMock]);

      const result = await controller.getVideosUser(payloadMock);

      expect(result).toEqual([userMock]);
    });

    it('should handle errors during getting videos for a user', async () => {
      jest
        .spyOn(service, 'getVideosUser')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(controller.getVideosUser(payloadMock)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('profile', () => {
    it('should get user profile', async () => {
      jest.spyOn(service, 'findById').mockResolvedValueOnce(userMock);

      const result = await controller.profile(payloadMock);

      expect(result).toEqual(userMock);
    });

    it('should handle errors during getting user profile', async () => {
      jest
        .spyOn(service, 'findById')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(controller.profile(payloadMock)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
  it('should handle conflict during user update (e.g., duplicate username)', async () => {
    const updateUserDto: UpdateUserDto = {
      email: 'test@email.com',
    };

    jest
      .spyOn(service, 'update')
      .mockRejectedValueOnce(new ConflictException());

    await expect(
      controller.update(payloadMock, updateUserDto),
    ).rejects.toThrowError(ConflictException);
  });
});
