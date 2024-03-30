import { AuthorizedGuard, Server, WHITE_LIST } from "server";
import { createServerPlatformKoa } from "server-platform-koa";
import "./controllers";
import { ServerStore } from "server-store";
import { createServerStoreFS } from "server-store-fs";
import { COLLECTION_ROLE, COLLECTION_USER, CONTEXT_NAME } from "./constants";

export async function bootstrap(port: number, saveOnExit = true) {
  const store = await ServerStore.create(
    createServerStoreFS("./store", saveOnExit),
  );
  const app = await Server.create({
    serverPlatformAdapter: createServerPlatformKoa(),
    contextName: CONTEXT_NAME,
    guards: [AuthorizedGuard],
  });
  app.dependencyInjection
    .bindInstance(store)
    .bindValue(WHITE_LIST, ["/user/login"]);
  await createDefaultData(app, store);
  app.bootstrap({ port, session: { secretKey: "secretKey" } });
}

async function createDefaultData(app: Server, store: ServerStore) {
  const roleCollection = store.collection<RoleModel>(COLLECTION_ROLE);
  const userCollection = store.collection<UserModel>(COLLECTION_USER);
  const defaultRole = await roleCollection.getById("0");
  const defaultUser = await userCollection.getById("0");
  if (!defaultRole) {
    await roleCollection.add(
      {
        _id: "0",
        name: "默认",
        authorizations: {},
        createTime: Date.now(),
      },
      roleCollection,
    );
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
///<reference types="../types.d.ts"/>
