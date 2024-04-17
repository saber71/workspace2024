import "./dist/index.js";
import { createDefaultData } from "./dist/index.js";
import json from "../server.json" with { type: "json" };
import { createServer } from "create-server";
import { createServerRuntimeNode } from "server-runtime-node";
import { createServerPlatformKoa } from "server-platform-koa";
import { createServerStoreFS } from "server-store-fs";

const serverPlatformAdapter = createServerPlatformKoa();
const runtime = createServerRuntimeNode();
export const app = await createServer({
  contextName: "server-user",
  serverPlatformAdapter,
  runtime,
  log: {
    serverLogCollection: "server-user-log",
  },
  storeAdapter: createServerStoreFS("../store", true),
  bootstrapOption: {
    port: json["server-user"].port,
  },
  whiteList: ["/user/login"],
});
await createDefaultData(app, app.dependencyInjection.getValue("ServerStore"));
