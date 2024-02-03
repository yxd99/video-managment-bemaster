import { Test, TestingModule } from '@nestjs/testing';
import { VideoLikesService } from './video-likes.service';

describe('VideoLikesService', () => {
  let service: VideoLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoLikesService],
    }).compile();

    service = module.get<VideoLikesService>(VideoLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
