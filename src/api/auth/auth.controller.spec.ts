import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

import { AuthService } from '@api/auth/auth.service';
import { AuthType } from '@api/auth/auth.type';
import { LoginDto } from '@api/auth/dto/login.dto';
import { CreateUserDto } from '@api/users/dto/create-user.dto';

import { AuthController } from './auth.controller';
import { Auth } from './auth.entity';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const loginDto: LoginDto = {
    email: '',
    password: '',
  };

  const createUserDto: CreateUserDto = {
    email: '',
    password: '',
    username: '',
    validatePassword: '',
  };

  const mockRepository: object = {
    save: jest.fn(),
    create: jest.fn(),
    find: jest.fn(() => []),
    findOneBy: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };
  const tokenRepository = getRepositoryToken(Auth);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
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

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user and return a token', async () => {
      const expectedAuthType: AuthType = {
        token: 'toke',
      };

      jest
        .spyOn(service, 'register')
        .mockImplementationOnce(async () => ({ token: '' }));
      jest
        .spyOn(service, 'login')
        .mockImplementationOnce(async () => expectedAuthType);

      const result = await controller.register(createUserDto);

      expect(result).toEqual(expectedAuthType);
    });

    it('should handle conflict during registration', async () => {
      jest
        .spyOn(service, 'register')
        .mockRejectedValueOnce(new ConflictException());

      await expect(controller.register(createUserDto)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login and return a token', async () => {
      const expectedAuthType: AuthType = {
        token: 'jwt',
      };

      jest
        .spyOn(service, 'login')
        .mockImplementationOnce(async () => expectedAuthType);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedAuthType);
    });

    it('should handle unauthorized during login', async () => {
      jest
        .spyOn(service, 'login')
        .mockRejectedValueOnce(new UnauthorizedException());

      await expect(controller.login(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });
});
