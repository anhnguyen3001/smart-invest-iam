import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotEnv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotEnv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private toNumber(value: string): number {
    return parseInt(value, 10);
  }

  private toBool(value: string): boolean {
    return value === 'true';
  }

  private toArray(value: string, delimiter = ','): string[] {
    return value.split(delimiter);
  }

  public getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public getValueOptional(key: string): string | undefined {
    return this.env[key];
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValueOptional('PORT');
  }

  public getPrettyPrint() {
    const value = this.getValueOptional('PRETTY_PRINT');
    return value && this.toBool(value);
  }

  public getLogLevel() {
    return this.getValueOptional('LOG_LEVEL');
  }

  public getTimeoutExternal() {
    return this.toNumber(this.getValueOptional('EXTERNAL_TIMEOUT') || '5000');
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: this.getValue('TYPEORM_CONNECTION') as any,
      host: this.getValue('TYPEORM_HOST'),
      port: this.toNumber(this.getValue('TYPEORM_PORT')),
      username: this.getValue('TYPEORM_USERNAME'),
      password: this.getValue('TYPEORM_PASSWORD'),
      database: this.getValue('TYPEORM_DATABASE'),
      entities: this.toArray(this.getValue('TYPEORM_ENTITIES')),
      migrations: this.getValue('TYPEORM_MIGRATIONS') as any,
      cli: {
        migrationsDir: this.getValue('TYPEORM_MIGRATIONS_DIR'),
      },
      charset: 'utf8mb4_unicode_ci',
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}

const configService = new ConfigService(process.env);

configService.ensureValues([
  'TYPEORM_CONNECTION',
  'TYPEORM_HOST',
  'TYPEORM_PORT',
  'TYPEORM_USERNAME',
  'TYPEORM_PASSWORD',
  'TYPEORM_DATABASE',
  'TYPEORM_ENTITIES',
  'TYPEORM_MIGRATIONS',
  'TYPEORM_MIGRATIONS_DIR',
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'MAIL_ACCOUNT',
  'MAIL_PASS',
  'MAIL_TOKEN_SECRET',
  'CLIENT_DOMAIN',
]);

export { configService };
