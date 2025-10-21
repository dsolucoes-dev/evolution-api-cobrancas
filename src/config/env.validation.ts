import { plainToInstance, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  @IsOptional()
  @IsString()
  PORT?: string = '3000';

  @IsNotEmpty()
  @IsString()
  EVALUE_CHAT_URL: string;

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  REDIS_PORT?: number = 6379;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  @IsOptional()
  @IsString()
  REDIS_USERNAME?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  REDIS_DB?: number = 0;
}

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors.map((error) => {
      const constraints = Object.values(error.constraints || {});
      return `${error.property}: ${constraints.join(', ')}`;
    });

    throw new Error(
      `❌ Erro na validação das variáveis de ambiente:\n${errorMessages.join('\n')}`,
    );
  }

  // eslint-disable-next-line no-console
  console.log('✅ Todas as variáveis de ambiente foram validadas com sucesso!');
  return validatedConfig;
}

export function checkRequiredEnvVars(): void {
  const requiredVars = ['DATABASE_URL', 'EVALUE_CHAT_URL', 'REDIS_HOST'];

  const missingVars: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    // eslint-disable-next-line no-console
    console.error('❌ Variáveis de ambiente obrigatórias não encontradas:');
    missingVars.forEach((varName) => {
      // eslint-disable-next-line no-console
      console.error(`  - ${varName}`);
    });
    // eslint-disable-next-line no-console
    console.error(
      '\n📝 Certifique-se de criar um arquivo .env com todas as variáveis necessárias.',
    );
    // eslint-disable-next-line no-console
    console.error(
      '💡 Consulte o arquivo .env.example para ver todas as variáveis requeridas.',
    );
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(
    '✅ Todas as variáveis de ambiente obrigatórias estão definidas!',
  );
}
