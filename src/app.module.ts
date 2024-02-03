import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { VideosModule } from './api/videos/videos.module';
import { AuthModule } from './auth/auth.module';
import { typeorm } from './config';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { UsersModule } from './users/users.module';

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
  ],
  providers: [Logger],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
