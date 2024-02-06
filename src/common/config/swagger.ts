import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { config } from '@common/constants';

const configSwagger = new DocumentBuilder()
  .setTitle(config.TITLE)
  .setDescription(config.DESCRIPTION)
  .setVersion(config.VERSION)
  .addBearerAuth();

config.SERVERS.forEach((server) => {
  configSwagger.addServer(server.host, server.description);
});

export const setup = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, configSwagger.build());
  SwaggerModule.setup(config.PREFIX, app, document, {
    customSiteTitle: config.TITLE,
  });
};
