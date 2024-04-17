import "./dist/index.js";
import { createDefaultData } from "./dist/index.js";
import { createServer } from "create-server";
import { createServerPlatformBrowser } from "server-platform-browser";
import { createServerRuntimeBrowser } from "server-runtime-browser";
import { createServerStoreIndexdb } from "server-store-indexdb";

const runtime = await createServerRuntimeBrowser();
export const app = await createServer({
  contextName: "server-user",
  serverPlatformAdapter: createServerPlatformBrowser(runtime),
  runtime,
  log: {
    serverLogCollection: "server-user-log",
  },
  storeAdapter: createServerStoreIndexdb(),
  whiteList: ["/user/login"],
});
await createDefaultData(app, app.dependencyInjection.getValue("ServerStore"));
