import { mockRoleModel } from "@/mock/role.controller.ts";
import { UserData } from "@/stores";
import { faker } from "@faker-js/faker/locale/zh_CN";
import type { UserController } from "server-user";

export function mockUserModel(data?: Partial<UserModel>): UserModel {
  return {
    _id: faker.string.uuid(),
    name: faker.internet.displayName(),
    loginName: "user",
    password: "123456",
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    roleId: faker.string.uuid(),
    createTime: faker.date.anytime().getTime(),
    userData: {
      [UserData.IsDarkTheme]: faker.number.int() % 2 === 0,
    },
    ...data,
  };
}

export const mockUserController: UserController = {
  findById(data) {
    return Promise.resolve(mockUserModel({ _id: data.id })) as any;
  },
  create() {
    return Promise.resolve([faker.string.uuid()]);
  },
  login() {
    return (this.auth as any)();
  },
  auth() {
    return Promise.resolve({
      ...mockUserModel(),
      authorizations: mockRoleModel().authorizations,
    });
  },
  logout() {
    return Promise.resolve();
  },
  updateUserData() {
    return Promise.resolve();
  },
};
