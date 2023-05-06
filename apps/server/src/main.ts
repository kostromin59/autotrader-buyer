import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import express from 'express';

async function bootstrap() {
  // Application
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Secure
  app.use(helmet());

  // Cookies
  app.use(cookieParser());

  app.use(
    express.json({
      limit: '1000mb',
    })
  );

  app.use(
    express.urlencoded({
      limit: '1000mb',
    })
  );

  // Global preifx
  const globalPrefix = process.env.GLOBAL_PREFIX || '';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: '*',
  });

  // Port
  const port = process.env.PORT || 3333;
  await app.listen(port);

  Logger.log(`🚀 Application is running on port ${port}/${globalPrefix}`);
}

bootstrap();
