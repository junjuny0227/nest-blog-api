import * as dotenv from 'dotenv';
dotenv.config();
process.env.JWT_SECRET ??= 'test-secret';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /posts returns 200', () => {
    return request(app.getHttpServer()).get('/posts').expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
