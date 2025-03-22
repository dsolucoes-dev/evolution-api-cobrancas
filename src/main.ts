
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
    )

  const config = new DocumentBuilder()
    .setTitle('Evalue Chat Cobrança API')
    .setDescription('API para gerenciamento de cobranças')
    .setContact('Dsoluções', 'https://dsolucoes.com', 'david@dsolucoes.dev.br')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
