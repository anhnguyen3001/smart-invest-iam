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
  it('1', () => {
    const a = 1;
  });
});

// describe('RoleApi - Upsert role', () => {
//   let app: INestApplication;
//   const apiUrl = `/v1/roles`;
//   let permissionRepository: Repository<Permission>;
//   let roleRepository: Repository<Role>;

//   beforeEach(async () => {
//     app = await createTestingApplication();

//     permissionRepository = await app.resolve<Repository<Permission>>(
//       getRepositoryToken(Permission),
//     );
//     roleRepository = await app.resolve<Repository<Role>>(
//       getRepositoryToken(Role),
//     );

//     await Promise.all([
//       permissionRepository.save({
//         id: 1,
//         code: 'test1',
//         name: 'test1',
//       }),
//       permissionRepository.save({
//         id: 2,
//         code: 'test2',
//         name: 'test2',
//       }),
//       roleRepository.save({
//         id: 1,
//         name: 'test user',
//         code: 'user',
//       }),
//     ]);

//     await app.init();
//   });

//   // it('(POST) update role success', async () => {
//   //   const updatedRole: UpdateRoleDto = {
//   //     name: 'test role',
//   //   };

//   //   const response = await request(app.getHttpServer())
//   //     .post(apiUrl)
//   //     .query({ id: 1 })
//   //     .send(updatedRole);

//   //   expect(response.status).toEqual(200);
//   //   const role = await request(app.getHttpServer()).

//   //   // expect(role.name).toEqual(updatedRole.name);
//   // });

//   // it('(POST) update role fail because of duplicate code', async () => {
//   //   const updatedRole: UpdateRoleDto = {
//   //     code: 'user',
//   //   };
//   //   const response = await request(app.getHttpServer())
//   //     .post(apiUrl)
//   //     .query({ id: 1 })
//   //     .send(updatedRole);
//   //   expect(response.status).toEqual(400);
//   //   expect(response.body.code).toEqual(ApiCode[400].EXISTED_ENTITY.code);
//   // });

//   // it('(POST) update role fail because of not found permissionIds', async () => {
//   //   const updatedRole: UpdateRoleDto = {
//   //     permissionIds: [3],
//   //   };
//   //   const response = await request(app.getHttpServer())
//   //     .post(apiUrl)
//   //     .send(updatedRole);

//   //   expect(response.status).toEqual(404);
//   //   expect(response.body.code).toEqual(ApiCode[404].NOT_FOUND.code);
//   // });

//   it('(POST) create role success', async () => {
//     const newRole: CreateRoleDto = {
//       name: 'test role',
//       code: 'test-role',
//     };
//     const response = await request(app.getHttpServer())
//       .post(apiUrl)
//       .send(newRole);
//     expect(response.status).toEqual(200);

//     const role = await roleRepository.findOne(response.body.data.id);
//     expect(role.name).toEqual(newRole.name);
//   });

//   it('(POST) create role success 1', async () => {
//     const newRole: CreateRoleDto = {
//       name: 'test role',
//       code: 'test-role',
//     };
//     const response = await request(app.getHttpServer())
//       .post(apiUrl)
//       .send(newRole);
//     // console.log(response);
//     // expect(response.status).toEqual(200);

//     // const role = await roleRepository.findOne(response.body.data.id);
//     // expect(role.name).toEqual(newRole.name);
//   });

//   it('(POST) create role fail because of duplicate code', async () => {
//     const newRole: CreateRoleDto = {
//       name: 'test role',
//       code: 'user',
//     };
//     const response = await request(app.getHttpServer())
//       .post(apiUrl)
//       .send(newRole);
//     expect(response.status).toEqual(400);
//     expect(response.body.code).toEqual(ApiCode[400].EXISTED_ENTITY.code);
//   });

//   it('(POST) create role fail because of not found permissionIds', async () => {
//     const newRole: CreateRoleDto = {
//       name: 'test role',
//       code: 'user1',
//       permissionIds: [3],
//     };
//     const response = await request(app.getHttpServer())
//       .post(apiUrl)
//       .send(newRole);
//     expect(response.status).toEqual(404);
//     expect(response.body.code).toEqual(ApiCode[404].NOT_FOUND.code);
//   });

//   it('(POST) create role fail because of invalid data', async () => {
//     const response = await request(app.getHttpServer()).post(apiUrl).send({
//       name: 1,
//       code: 2,
//       permissionIds: 3,
//     });

//     expect(response.status).toEqual(400);
//     expect(response.body.code).toEqual(ApiCode[400].VALIDATION_ERROR.code);
//     expect(response.body.details.name).toBeDefined();
//     expect(response.body.details.code).toBeDefined();
//     expect(response.body.details.permissionIds).toBeDefined();
//   });

//   it('(POST) create role fail because of lack of required fields', async () => {
//     const response = await request(app.getHttpServer()).post(apiUrl);

//     expect(response.status).toEqual(400);
//     expect(response.body.code).toEqual(ApiCode[400].VALIDATION_ERROR.code);
//     expect(response.body.details.name).toBeDefined();
//     expect(response.body.details.code).toBeDefined();
//   });

//   afterEach(async () => {
//     await app.close();
//   });
// });
