import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('KeyProd')
    .setDescription('The KeyProd API')
    .setVersion('1.0')
    .build();

  const catDocument = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, catDocument);

  await app.listen(3000);
}
bootstrap();
