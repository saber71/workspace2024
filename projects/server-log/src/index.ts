///<reference types="../types.d.ts"/>

import { Server } from "server";
import { createServerPlatformExpress } from "server-platform-express";
import { ServerStore } from "server-store";
import { createServerStoreFS } from "server-store-fs";
import { CONTEXT_NAME } from "./constants";
import "./dto";
import "./controller";

export async function bootstrap(port: number, saveOnExit = true) {
  const store = await ServerStore.create(
    createServerStoreFS("../store", saveOnExit),
  );
  const app = await Server.create({
    serverPlatformAdapter: createServerPlatformExpress(),
    contextName: CONTEXT_NAME,
  });
  app.dependencyInjection.bindInstance(store);
  app.bootstrap({ port });
}

export * from "./controller";
export * from "./decorator";
export * from "./constants";
