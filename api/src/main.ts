import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())

  const options = new DocumentBuilder()
    .setTitle('KeyProd API')
    .setDescription('New generation of the KeyProd API')
    .setVersion('1.0')
    .build();

  const catDocument = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, catDocument);

  await app.listen(3000);
}
bootstrap();
