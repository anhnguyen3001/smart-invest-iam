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
      type: this.getValue('DB_CONNECTION') as any,
      host: this.getValue('DB_HOST'),
      port: this.toNumber(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),
      entities: this.toArray(this.getValue('DB_ENTITIES')),
      charset: 'utf8mb4_unicode_ci',
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}

const configService = new ConfigService(process.env);

configService.ensureValues([
  'DB_CONNECTION',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'DB_ENTITIES',
]);

export { configService };
