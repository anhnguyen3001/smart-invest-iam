import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { register } from 'prom-client';
import { createTestingApplication } from '../../../../test/helpers';

describe('AuthController - GetHello', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApplication();
    await app.init();
  });

  it('(Hell) Hello word', async () => {
    expect('abc').toBe('abc');
    const response = await request(app.getHttpServer()).get(`/v1/app`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.text).toBe('Hello World!');
  });

  afterEach(async () => {
    register.clear();
    await app.close();
  });
});
