import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsModule } from '@api/comments/comments.module';
import { UsersModule } from '@api/users/users.module';
import { VideosModule } from '@api/videos/videos.module';

import { Like } from './entities/like.entity';
import { Target } from './entities/target.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Target]),
    UsersModule,
    VideosModule,
    CommentsModule,
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
