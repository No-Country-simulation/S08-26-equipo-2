import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // LiveKit envía el body con 'application/webhook+json'; express.json() no lo
  // parsea, así que registramos un parser raw que captura los bytes exactos.
  app.useBodyParser('raw', { type: 'application/webhook+json' });

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('S08-26 Backend API')
    .setDescription('API del proyecto S08-26-equipo-2')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
