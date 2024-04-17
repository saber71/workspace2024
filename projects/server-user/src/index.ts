// @ts-ignore
///<reference types="../types.d.ts"/>

import "./controllers";
import { COLLECTION_ROLE, COLLECTION_USER } from "./constants";
import { Server, ServerStore } from "create-server";

async function createDefaultData(app: Server, store: ServerStore) {
  const roleCollection = store.collection<RoleModel>(COLLECTION_ROLE);
  const userCollection = store.collection<UserModel>(COLLECTION_USER);
  const defaultRole = await roleCollection.getById("0");
  const defaultUser = await userCollection.getById("0");
  if (!defaultRole) {
    await roleCollection.add({
      _id: "0",
      name: "默认",
      authorizations: {},
      createTime: Date.now(),
    });
    app.log("log", "新建默认角色成功");
  }
  if (!defaultUser) {
    await userCollection.add({
      _id: "0",
      name: "默认",
      loginName: "default-user",
      password: "123456",
      roleId: "0",
      email: "default-user@example.com",
      userData: {},
      createTime: Date.now(),
    });
    app.log("log", "新建默认用户成功");
  }
}

export * from "./dto";
export * from "./constants";
export * from "./controllers";
