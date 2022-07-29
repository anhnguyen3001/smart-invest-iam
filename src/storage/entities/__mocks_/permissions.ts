import { Permission } from '../permission.entity';

export const mockPermission: Permission = {
  id: 1,
  name: 'test permission',
  code: 'test-permission',
  roles: [],
  routes: [],
  createdAt: new Date().toLocaleString(),
  updatedAt: new Date().toLocaleString(),
  deletedAt: new Date().toLocaleString(),
};
