import {
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

import { createMockFile, payloadMock, videoMock } from '@common/mocks';

import { TYPE_PRIVACY } from './constants';
import { CreateVideoDto } from './dto/create-video.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';

const moduleMocker = new ModuleMocker(global);

describe('VideosController', () => {
  let controller: VideosController;
  let service: VideosService;

  const createVideoDto: CreateVideoDto = {
    description: '',
    privacy: TYPE_PRIVACY.PUBLIC,
    title: '',
    video: createMockFile(),
  };
  const queryParams: QueryParamsDto = {
    privacy: TYPE_PRIVACY.PUBLIC,
    search: '',
  };

  const mockRepository: object = {
    save: jest.fn(() => videoMock),
    create: jest.fn(),
    find: jest.fn(() => []),
    findOneBy: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };
  const tokenRepository = getRepositoryToken(Video);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [
        VideosService,
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

    controller = module.get<VideosController>(VideosController);
    service = module.get<VideosService>(VideosService);
  });
  describe('create', () => {
    it('should create a video', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce(videoMock);

      const result = await controller.create(
        createMockFile(),
        createVideoDto,
        payloadMock,
      );

      expect(result).toEqual({
        message: `video has been created, url: ${videoMock.url}`,
      });
    });

    it('should handle errors during video creation', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new ForbiddenException('You must log in first'));

      await expect(
        controller.create(createMockFile(), createVideoDto, payloadMock),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('should handle conflict during video creation', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(
          new ConflictException('Video with same name already exists'),
        );

      await expect(
        controller.create(createMockFile(), createVideoDto, payloadMock),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should find all videos for logged-in user', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([videoMock]);

      const result = await controller.findAll(payloadMock, queryParams);

      expect(result).toEqual([videoMock]);
    });

    it('should find all videos for public access', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([videoMock]);

      const result = await controller.findAll(undefined, queryParams);

      expect(result).toEqual([videoMock]);
    });

    it('should handle errors during finding all videos', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockRejectedValueOnce(new ForbiddenException('You must log in first'));

      await expect(
        controller.findAll(payloadMock, queryParams),
      ).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('should find a video by id for logged-in user', async () => {
      const id = 1;

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(videoMock);

      const result = await controller.findOne(id, payloadMock);

      expect(result).toEqual(videoMock);
    });

    it('should find a video by id for public access', async () => {
      const id = 1;

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(videoMock);

      const result = await controller.findOne(id, undefined);

      expect(result).toEqual(videoMock);
    });

    it('should handle errors during finding a video by id', async () => {
      const id = 1;

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new ForbiddenException('This video is private'));

      await expect(controller.findOne(id, payloadMock)).rejects.toThrowError(
        ForbiddenException,
      );
    });

    it('should handle not found error during finding a video by id', async () => {
      const id = 1;

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(controller.findOne(id, payloadMock)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a video', async () => {
      const id = 1;
      const updateVideoDto: UpdateVideoDto = {
        title: 'test',
      };

      jest.spyOn(service, 'update').mockResolvedValueOnce({ message: '' });

      const result = await controller.update(id, updateVideoDto, null);

      expect(result).toEqual({
        message: 'video has been updated',
      });
    });

    it('should handle errors during video update', async () => {
      const id = 1;
      const updateVideoDto: UpdateVideoDto = {
        description: 'test',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.update(id, updateVideoDto, createMockFile()),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should handle conflict during video update', async () => {
      const id = 1;
      const updateVideoDto: UpdateVideoDto = {
        privacy: TYPE_PRIVACY.PUBLIC,
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(
          new ConflictException('Video with same name already exists'),
        );

      await expect(
        controller.update(id, updateVideoDto, createMockFile()),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a video for logged-in user', async () => {
      const id = 1;

      jest.spyOn(service, 'remove').mockResolvedValueOnce({ message: '' });

      const result = await controller.remove(id, payloadMock);

      expect(result).toEqual({ message: '' });
    });

    it('should handle errors during video removal', async () => {
      const id = 1;

      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(controller.remove(id, payloadMock)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should handle forbidden error during video removal', async () => {
      const id = 1;

      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(
          new ForbiddenException('You are not allowed to remove this video'),
        );

      await expect(controller.remove(id, payloadMock)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });
});
