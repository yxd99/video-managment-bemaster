import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AuthModule } from '@api/auth/auth.module';
import { CommentsModule } from '@api/comments/comments.module';
import { LikesModule } from '@api/likes/likes.module';
import { UsersModule } from '@api/users/users.module';
import { VideosModule } from '@api/videos/videos.module';
import { typeorm } from '@common/config';
import { ErrorHandlerModule } from '@common/error-handler/error-handler.module';
import { CloudinaryModule } from '@shared/cloudinary/cloudinary.module';

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
    LikesModule,
    CommentsModule,
    ErrorHandlerModule,
  ],
  providers: [Logger],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
