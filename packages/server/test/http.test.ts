import { createServerPlatformExpress } from "server-platform-express";
import { createServerPlatformKoa } from "server-platform-koa";
import { describe, test } from "vitest";
import { Server } from "../src";
import { commonControllerHttpTestSuits } from "./util/common.controller";
import { errorControllerHttpTestSuits } from "./util/error.controller";
import { userControllerHttpTestSuits } from "./util/user.controller";

describe("http", () => {
  test.concurrent("koa", async () => {
    const app = await Server.create({
      serverPlatformAdapter: createServerPlatformKoa(),
    });
    app.bootstrap({
      session: {
        secretKey: "secretKey",
      },
    });

    await Promise.all([
      userControllerHttpTestSuits(),
      errorControllerHttpTestSuits(),
      commonControllerHttpTestSuits(),
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
      commonControllerHttpTestSuits(),
    ]);
  });
});
