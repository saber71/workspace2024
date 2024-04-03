import { httpTest } from "http-test";
import { describe, test } from "vitest";
import { bootstrap } from "../src";

describe("ServerLog", () => {
  test.concurrent("basic", async () => {
    await bootstrap(4000, false);

    await httpTest({
      url: "/log/create",
      method: "POST",
      data: {
        creator: "",
        description: "description",
        url: "",
      },
    })
      .expectStatus(500)
      .done();

    await httpTest({
      url: "/log/create",
      method: "POST",
      data: {
        creator: "0",
        description: "description",
        url: "",
      },
    })
      .expectStatus(200)
      .done();

    await httpTest({
      url: "/log/find",
      params: {
        creator: "0",
      },
    })
      .filterBody((data) => {
        if (data.object instanceof Array)
          data.object.forEach((item) => {
            delete item.createTime;
            delete item._id;
          });
        return data;
      })
      .expectBodyData([{ creator: "0", description: "description", url: "" }])
      .done();
  });
});
