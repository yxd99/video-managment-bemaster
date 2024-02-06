import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { swagger } from '@common/config';
import { config } from '@common/constants';

import { AppModule } from './app.module';

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
