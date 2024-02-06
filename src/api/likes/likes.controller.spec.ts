import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

import { likeMock, payloadMock } from '@common/mocks';

import { Like } from './entities/like.entity';
import { Target } from './entities/target.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

const moduleMocker = new ModuleMocker(global);

describe('LikesController', () => {
  let controller: LikesController;
  let service: LikesService;

  const mockRepository: object = {
    save: jest.fn(() => likeMock),
    create: jest.fn(),
    find: jest.fn(() => []),
    findOneBy: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };
  const tokenLikeRepository = getRepositoryToken(Like);
  const tokenTargetRepository = getRepositoryToken(Target);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        LikesService,
        { provide: tokenLikeRepository, useValue: mockRepository },
        { provide: tokenTargetRepository, useValue: mockRepository },
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

    controller = module.get<LikesController>(LikesController);
    service = module.get<LikesService>(LikesService);
  });

  describe('toggleLikeVideo', () => {
    it('should toggle like for video', async () => {
      const videoId = 1;

      jest.spyOn(service, 'toggleLike').mockResolvedValueOnce(likeMock);

      const result = await controller.toggleLikeVideo(videoId, payloadMock);

      expect(result).toEqual(likeMock);
    });

    it('should handle not found error during toggle like for video', async () => {
      const videoId = 1;

      jest
        .spyOn(service, 'toggleLike')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.toggleLikeVideo(videoId, payloadMock),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('toggleLikeComentario', () => {
    it('should toggle like for comentario', async () => {
      const comentarioId = 1;

      jest.spyOn(service, 'toggleLike').mockResolvedValueOnce(likeMock);

      const result = await controller.toggleLikeComentario(
        comentarioId,
        payloadMock,
      );

      expect(result).toEqual(likeMock);
    });

    it('should handle not found error during toggle like for comentario', async () => {
      const comentarioId = 1;

      jest
        .spyOn(service, 'toggleLike')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.toggleLikeComentario(comentarioId, payloadMock),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getMostLikedVideos', () => {
    it('should get most liked videos', async () => {
      jest
        .spyOn(service, 'getMostLikedVideos')
        .mockResolvedValueOnce([likeMock]);

      const result = await controller.getMostLikedVideos();

      expect(result).toEqual([likeMock]);
    });
  });

  describe('getMostLikedComentarios', () => {
    it('should get most liked comentarios', async () => {
      jest
        .spyOn(service, 'getMostLikedComments')
        .mockResolvedValueOnce([likeMock]);

      const result = await controller.getMostLikedComentarios();

      expect(result).toEqual([likeMock]);
    });
  });
});
