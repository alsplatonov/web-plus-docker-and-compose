import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('KUPIPODARIDAY BACKEND')
    .setDescription('Документация REST API')
    .setVersion('0.0.1')
    .addTag('A Platonov')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
