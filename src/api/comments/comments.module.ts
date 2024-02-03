import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentsController } from '@api/comments/comments.controller';
import { CommentsService } from '@api/comments/comments.service';
import { Comment } from '@api/comments/entities/comment.entity';
import { VideosModule } from '@api/videos/videos.module';
import { UsersModule } from '@root/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, VideosModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
