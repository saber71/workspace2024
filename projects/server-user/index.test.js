import "./src";
import { createDefaultData } from "./src";
import { createServer } from "create-server";
import { createServerRuntimeNode } from "server-runtime-node";
import { createServerStoreFS } from "server-store-fs";
import { createServerPlatformKoa } from "server-platform-koa";
import { app } from "./index.js";

const runtime = createServerRuntimeNode();
const serverPlatformAdapter = createServerPlatformKoa();
await createServer({
  contextName: "server-user",
  serverPlatformAdapter,
  runtime,
  log: {
    serverLogCollection: "server-user-log",
  },
  storeAdapter: createServerStoreFS("../store"),
  bootstrapOption: {
    port: 4000,
  },
  whiteList: ["/user/login"],
});
await createDefaultData(app, app.dependencyInjection.getValue("ServerStore"));
