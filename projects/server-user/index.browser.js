import "./dist/index.js";
import json from "../server.json" with { type: "json" };
import { createServer } from "create-server";
import { createServerPlatformBrowser } from "server-platform-browser";
import { createServerRuntimeBrowser } from "server-runtime-browser";
import { createServerStoreIndexdb } from "server-store-indexdb";

const runtime = await createServerRuntimeBrowser();
await createServer({
  contextName: "server-user",
  serverPlatformAdapter: createServerPlatformBrowser(runtime),
  runtime,
  log: {
    serverLogCollection: "server-user-log",
  },
  storeAdapter: createServerStoreIndexdb(),
  bootstrapOption: {
    port: json["server-user"].port,
  },
  whiteList: ["/user/login"],
});
