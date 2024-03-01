import { createServerPlatformExpress } from "server-platform-express";
import { createServerPlatformKoa } from "server-platform-koa";
import { describe, test } from "vitest";
import { Server } from "../src";
import { errorControllerHttpTestSuits } from "./util/error.controller";
import { userControllerHttpTestSuits } from "./util/user.controller";

describe("http", () => {
  test.concurrent("koa", async () => {
    const app = await Server.create({
      serverPlatformAdapter: createServerPlatformKoa(),
    });
    app.bootstrap();

    await Promise.all([
      userControllerHttpTestSuits(),
      errorControllerHttpTestSuits(),
    ]);
  });

  test.concurrent("express", async () => {
    const app = await Server.create({
      serverPlatformAdapter: createServerPlatformExpress(),
    });
    app.bootstrap({
      hostname: "localhost",
    });

    await Promise.all([
      userControllerHttpTestSuits(),
      errorControllerHttpTestSuits(),
    ]);
  });
});
