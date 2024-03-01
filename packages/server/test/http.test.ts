import { createServerPlatformKoa } from "server-platform-koa";
import { describe, test } from "vitest";
import { Server } from "../src";
import { errorControllerHttpTestSuits } from "./util/error.controller";
import { userControllerHttpTestSuits } from "./util/user.controller";

describe("http", () => {
  test("koa", async () => {
    const app = await Server.create({
      serverPlatformAdapter: createServerPlatformKoa(),
    });
    app.bootstrap();

    await Promise.all([
      userControllerHttpTestSuits(),
      errorControllerHttpTestSuits(),
    ]);
  });
});
