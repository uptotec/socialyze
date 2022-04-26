import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SanitizeMongooseModelInterceptor());

  await app.listen(3000);
}
bootstrap();
