import { HttpStatus, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from 'src/storage/entities/role.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { createTestingApplication } from '../../../test/helpers';

describe('RoleApi - Get list', () => {
  it('1', () => {
    const a = 1;
  });
  it('1', () => {
    const a = 1;
  });
  it('1', () => {
    const a = 1;
  });
  it('1', () => {
    const a = 1;
  });
  it('1', () => {
    const a = 1;
  });
  it('1', () => {
    const a = 1;
  });
});

// describe('RoleApi - Get list', () => {
//   let app: INestApplication;
//   const apiUrl = '/v1/roles';
//   let roleRepository: Repository<Role>;

//   beforeEach(async () => {
//     app = await createTestingApplication();

//     roleRepository = await app.resolve<Repository<Role>>(
//       getRepositoryToken(Role),
//     );

//     await Promise.all([
//       roleRepository.save({
//         id: 1,
//         code: 'admin',
//         name: 'Admin',
//       }),
//       roleRepository.save({
//         id: 2,
//         code: 'user',
//         name: 'User',
//       }),
//     ]);

//     await app.init();
//   });

//   it('(GET) get list roles success without any filter return id descent', async () => {
//     const res = await request(app.getHttpServer()).get(apiUrl);
//     expect(res.status).toEqual(HttpStatus.OK);

//     expect(res.body.data.roles.map((el) => el.id)).toStrictEqual([2, 1]);
//     expect(res.body.data.pagination).toStrictEqual({
//       totalItems: 2,
//       totalPages: 1,
//     });
//   });

//   it('(GET) get list roles success with filter existed q', async () => {
//     const text = '1';
//     const res = await request(app.getHttpServer()).get(apiUrl).query({
//       q: text,
//     });
//     expect(res.status).toEqual(HttpStatus.OK);

//     let isValidList = true;
//     const reg = new RegExp(text);
//     for (const role of res.body.data.roles) {
//       if (!reg.test(role.id) && !reg.test(role.name) && !reg.test(role.code)) {
//         isValidList = false;
//         break;
//       }
//     }

//     expect(isValidList).toBe(true);
//   });

//   it('(GET) get list roles success with filter not existed q => empty list', async () => {
//     const text = 'text';
//     const res = await request(app.getHttpServer()).get(apiUrl).query({
//       q: text,
//     });
//     expect(res.status).toEqual(HttpStatus.OK);
//     expect(res.body.data.roles.length).toBe(0);
//   });

//   it('(GET) get list roles success with filter page > 1 => empty list', async () => {
//     const res = await request(app.getHttpServer()).get(apiUrl).query({
//       page: 2,
//       pageSize: 20,
//     });
//     expect(res.status).toEqual(HttpStatus.OK);
//     expect(res.body.data.roles.length).toBe(0);
//   });

//   it('(GET) get list roles success with filter page > 1 => not empty list', async () => {
//     const res = await request(app.getHttpServer()).get(apiUrl).query({
//       page: 2,
//       pageSize: 1,
//     });
//     expect(res.status).toEqual(HttpStatus.OK);
//     expect(res.body.data.roles.length).toBe(1);
//   });

//   it('(GET) get all roles success', async () => {
//     const res = await request(app.getHttpServer()).get(apiUrl).query({
//       getAll: true,
//     });
//     expect(res.status).toEqual(HttpStatus.OK);
//     expect(res.body.data.pagination).toStrictEqual({
//       totalItems: 2,
//       totalPages: 1,
//     });
//     expect(res.body.data.roles.length).toBe(2);
//   });

//   afterEach(async () => {
//     await app.close();
//   });
// });
