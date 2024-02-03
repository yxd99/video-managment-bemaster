import { Test, TestingModule } from '@nestjs/testing';

import { VideoLikesController } from './video-likes.controller';
import { VideoLikesService } from './video-likes.service';

describe('VideoLikesController', () => {
  let controller: VideoLikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoLikesController],
      providers: [VideoLikesService],
    }).compile();

    controller = module.get<VideoLikesController>(VideoLikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
