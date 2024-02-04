import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { CommentsModule } from '@api/comments/comments.module';
import { VideoLikesModule } from '@api/video-likes/video-likes.module';

import { UsersModule } from './api/users/users.module';
import { VideosModule } from './api/videos/videos.module';
import { AuthModule } from './auth/auth.module';
import { typeorm } from './commons/config';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeorm.config()),
    AuthModule,
    UsersModule,
    VideosModule,
    CloudinaryModule,
    VideoLikesModule,
    CommentsModule,
  ],
  providers: [Logger],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
