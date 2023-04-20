import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Application
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Secure
  app.use(helmet());

  // Cookies
  app.use(cookieParser());

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
