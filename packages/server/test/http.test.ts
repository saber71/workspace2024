import { createServerPlatformExpress } from "server-platform-express";
import { createServerPlatformKoa } from "server-platform-koa";
import { describe, test } from "vitest";
import { Server, WHITE_LIST, AuthorizedGuard } from "../src";
import { commonControllerHttpTestSuits } from "./util/common.controller";
import { errorControllerHttpTestSuits } from "./util/error.controller";
import { userControllerHttpTestSuits } from "./util/user.controller";

describe("http", () => {
  test.concurrent("koa", async () => {
    const app = await Server.create({
      serverPlatformAdapter: createServerPlatformKoa(),
      guards: [AuthorizedGuard],
    });
    app.dependencyInjection.bindValue(WHITE_LIST, ["*"]);
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
      guards: [AuthorizedGuard],
    });
    app.dependencyInjection.bindValue(WHITE_LIST, ["*"]);
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
