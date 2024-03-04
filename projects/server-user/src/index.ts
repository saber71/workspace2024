///<reference types="../types.d.ts"/>
import { connect } from "mongoose";
import { Server } from "server";
import { createServerPlatformKoa } from "server-platform-koa";
import "./models";
import "./controllers";
import { RoleController } from "./controllers";
import { CONTEXT_NAME, MONGODB_URL } from "./constants";

export async function bootstrap(port: number) {
  const app = await Server.create({
    serverPlatformAdapter: createServerPlatformKoa(),
    contextName: CONTEXT_NAME,
  });
  await connect(MONGODB_URL, { dbName: CONTEXT_NAME });
  app.log("log", `成功连接${MONGODB_URL}`);
  await checkAndInitRole(app);
  app.bootstrap({ port });
}

/* 检查数据库中的Role对象数量，如果数据库为空则新建一个默认角色 */
async function checkAndInitRole(app: Server) {
  const controller = app.dependencyInjection.getValue(RoleController);
  const count = await controller.count();
  if (count === 0) {
    const roleId = await controller.create({
      name: "默认",
      authorizations: {},
    });
    app.log("log", "新建默认角色成功，id为" + roleId);
  }
}

export * from "./providers";
