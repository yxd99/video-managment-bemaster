import {
  HttpException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { commentMock, payloadMock } from '@common/mocks';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

const moduleMocker = new ModuleMocker(global);
describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const createCommentDto: CreateCommentDto = {
    comment: 'test',
  };
  const videoId = 1;

  const updateComment: UpdateCommentDto = {
    comment: '',
  };
  const mockRepository: object = {
    save: jest.fn(() => commentMock),
    create: jest.fn(),
    find: jest.fn(() => []),
    findOneBy: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };
  const tokenRepository = getRepositoryToken(Comment);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsService,
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

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce({
        message: '',
      });

      const result = await controller.create(
        createCommentDto,
        videoId,
        payloadMock,
      );

      expect(result).toEqual({
        message: '',
      });
    });

    it('should handle errors during comment creation', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new HttpException('Bad Request', 400));

      await expect(
        controller.create(createCommentDto, videoId, payloadMock),
      ).rejects.toThrowError(HttpException);
    });
  });

  describe('findByVideo', () => {
    it('should find comments by video', async () => {
      const comments: Comment[] = [commentMock];

      jest.spyOn(service, 'findByVideo').mockResolvedValueOnce(comments);

      const result = await controller.findByVideo(videoId, payloadMock);

      expect(result).toEqual(comments);
    });

    it('should handle errors during finding comments by video', async () => {
      jest
        .spyOn(service, 'findByVideo')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.findByVideo(videoId, payloadMock),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should find a comment by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(commentMock);

      const result = await controller.findOne(commentMock.id, payloadMock);

      expect(result).toEqual(commentMock);
    });

    it('should handle errors during finding a comment by id', async () => {
      const commentId = 1;
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(
        controller.findOne(commentId, payloadMock),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce({
        message: '',
      });

      const result = await controller.update(
        commentMock.id,
        updateComment,
        payloadMock,
      );

      expect(result).toEqual({
        message: '',
      });
    });

    it('should handle errors during comment update', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new ForbiddenException());

      await expect(
        controller.update(commentMock.id, updateComment, payloadMock),
      ).rejects.toThrowError(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce({
        message: '',
      });

      const result = await controller.remove(commentMock.id, payloadMock);

      expect(result).toEqual({
        message: '',
      });
    });

    it('should handle errors during comment removal', async () => {
      const commentId = 1;
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new ForbiddenException());

      await expect(
        controller.remove(commentId, payloadMock),
      ).rejects.toThrowError(ForbiddenException);
    });
  });
});
