import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module';
import {
    checkRequiredEnvVars,
    validateEnvironment,
} from './config/env.validation';

async function bootstrap() {
  // Validar variáveis de ambiente antes de inicializar a aplicação
  // eslint-disable-next-line no-console
  console.log('🔍 Verificando variáveis de ambiente...');
  checkRequiredEnvVars();
  validateEnvironment(process.env);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.enableCors();

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
