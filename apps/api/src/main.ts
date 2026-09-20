import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { getCorsOrigins, getEnv } from './config/env';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: getCorsOrigins(), credentials: true });
  app.enableShutdownHooks();

  const port = getEnv().API_PORT;
  await app.listen(port, '0.0.0.0');

  Logger.log(`API listening on http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
