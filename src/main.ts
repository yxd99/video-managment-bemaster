import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { swagger } from './config';
import { config } from './constants';

async function bootstrap() {
  const port = config.PORT ?? 3000;
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  swagger.setup(app);
  app.setGlobalPrefix(config.PREFIX);

  await app.listen(port, async () => {
    Logger.log(`App in: ${await app.getUrl()}`, 'Bootstrap');
  });
}

bootstrap();
