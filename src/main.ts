import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Настройка CORS для работы с вашим фронтендом
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Оставляем только один способ обработки статических файлов
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const usersService = app.get(UsersService);
  await usersService.updateNullUsernames();

  await app.listen(3000);
}
bootstrap();