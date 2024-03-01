import { describe, test } from "vitest";
import { ExpectResponse } from "../src";

describe("HttpTest", () => {
  test("ExpectResponse", async () => {
    await new ExpectResponse({
      headers: {
        "Cache-Control": "no-cache",
        "Content-Encoding": "zh-CN",
        "Content-Type": "application/json",
      },
      status: 200,
      data: {
        name: "abc",
      },
    })
      .expectBody({ name: "abc" })
      .expectStatus(200)
      .expectHeader("Cache-Control", "no-cache")
      .expectHeader("Content-Encoding", "zh-CN")
      .expectHeader("Content-Type", "application/json")
      .done();
  });
});
