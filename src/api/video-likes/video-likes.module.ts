import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VideosModule } from '@api/videos/videos.module';
import { UsersModule } from '@root/users/users.module';

import { VideoLike } from './entities/video-like.entity';
import { VideoLikesController } from './video-likes.controller';
import { VideoLikesService } from './video-likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoLike]), UsersModule, VideosModule],
  controllers: [VideoLikesController],
  providers: [VideoLikesService],
  exports: [VideoLikesService],
})
export class VideoLikesModule {}
