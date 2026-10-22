import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('graduate/api/v1');
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN, methods: 'GET,HEAD,POST,PATCH,DELETE' });
  const config = new DocumentBuilder()
    .setTitle('Graduate API — MVP')
    .setDescription('API do NEAP. Rotas acadêmicas exigem JWT Keycloak.')
    .setVersion('0.1.0').addBearerAuth().build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));
  await app.listen(Number(process.env.PORT ?? 3000));
}
bootstrap();
