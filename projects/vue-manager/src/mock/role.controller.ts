import { faker } from "@faker-js/faker/locale/zh_CN";
import type { RoleController } from "server-user";

export function mockRoleModel(data?: Partial<RoleModel>): RoleModel {
  return {
    _id: faker.string.uuid(),
    name: faker.internet.displayName(),
    createTime: faker.date.anytime().getTime(),
    authorizations: {},
    ...data,
  };
}

export const mockRoleController: RoleController = {
  findById(data) {
    return Promise.resolve(mockRoleModel({ _id: data.id }));
  },
  create() {
    return Promise.resolve([faker.string.uuid()]);
  },
  update() {
    return Promise.resolve();
  },
};
