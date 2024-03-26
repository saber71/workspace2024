import { AuthorizedGuard, Server, WHITE_LIST } from "server";
import { createServerPlatformKoa } from "server-platform-koa";
import "./controllers";
import { ServerStore } from "server-store";
import { createServerStoreFS } from "server-store-fs";
import { RoleController } from "./controllers";
import { COLLECTION_ROLE, CONTEXT_NAME } from "./constants";

export async function bootstrap(port: number) {
  const store = await ServerStore.create(createServerStoreFS("./store"));
  const app = await Server.create({
    serverPlatformAdapter: createServerPlatformKoa(),
    contextName: CONTEXT_NAME,
    guards: [AuthorizedGuard],
  });
  app.dependencyInjection
    .bindInstance(store)
    .bindValue(WHITE_LIST, ["/user/login"]);
  await checkAndInitRole(app, store);
  app.bootstrap({ port });
}

/* 检查数据库中的Role对象数量，如果数据库为空则新建一个默认角色 */
async function checkAndInitRole(app: Server, store: ServerStore) {
  const controller = app.dependencyInjection.getValue(RoleController);
  const collection = store.collection<RoleModel>(COLLECTION_ROLE);
  const count = await controller.count(collection);
  if (count === 0) {
    const roleId = await controller.create(
      {
        name: "默认",
        authorizations: {},
      },
      collection,
    );
    app.log("log", "新建默认角色成功，id为" + roleId);
  }
}

export * from "./dto";
///<reference types="../types.d.ts"/>
