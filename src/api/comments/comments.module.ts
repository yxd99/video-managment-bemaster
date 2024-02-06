import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsController } from '@api/comments/comments.controller';
import { CommentsService } from '@api/comments/comments.service';
import { Comment } from '@api/comments/entities/comment.entity';
import { UsersModule } from '@api/users/users.module';
import { VideosModule } from '@api/videos/videos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, VideosModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
