import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function config(): TypeOrmModuleOptions {
  const configService = new ConfigService();
  const environment = configService.get('ENV') ?? 'development';
  return {
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: Number(configService.get('DB_PORT')),
    database: configService.get('DB_NAME'),
    schema: 'public',
    type: 'postgres',
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    synchronize: environment !== 'prod',
    entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    autoLoadEntities: true,
    migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  };
}
