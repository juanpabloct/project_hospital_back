import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { DomainExceptionsFilter } from './common/filters/domain-exceptions.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Register Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Strips non-whitelisted properties from requests
      transform: true,       // Automatically transforms payloads to match DTO types
      forbidNonWhitelisted: true,
    }),
  );

  // Register Global Domain Exception Filter
  app.useGlobalFilters(new DomainExceptionsFilter());

  // Enable CORS for frontend integration
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 El sistema hospitalario está corriendo en: http://localhost:${port}/api`);
}
bootstrap();
