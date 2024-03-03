///<reference types="../types.d.ts"/>
import { Server } from "server";
import { createServerPlatformKoa } from "server-platform-koa";

const app = await Server.create({
  serverPlatformAdapter: createServerPlatformKoa(),
});
app.bootstrap({ port: 4001 });
