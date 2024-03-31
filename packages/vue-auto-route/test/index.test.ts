import { describe, expect, test } from "vitest";
import { RouteRecordRaw } from "vue-router";
import { autoRoutes } from "../src";

function mockComponent(index: number) {
  return { default: index };
}

describe("AutoRoutes", () => {
  test.concurrent("basic", async () => {
    expect(
      await autoRoutes(
        {
          "./1.ts": mockComponent(1),
          "./2.ts": () => mockComponent(2),
          "./3.ts": () => Promise.resolve(mockComponent(3)),
          "./4.ts": Promise.resolve(mockComponent(4)),
          "./1.home.ts": Promise.resolve(mockComponent(5)),
          "./1/1.home.ts": mockComponent(11),
          "./1/2.ts": mockComponent(12),
          "./1/2/1.home.ts": mockComponent(121),
        },
        ".",
      ),
    ).toEqual({
      path: "/",
      children: [
        {
          path: "1",
          redirect: "/1/1",
          children: [
            {
              path: "1",
              children: [],
              component: 11 as any,
            },
            {
              path: "2",
              redirect: "/1/2/1",
              children: [
                {
                  path: "1",
                  children: [],
                  component: 121 as any,
                },
              ],
              component: 12 as any,
            },
          ],
          component: 5 as any,
        },
        {
          path: "2",
          children: [],
          component: 2 as any,
        },
        {
          path: "3",
          children: [],
          component: 3 as any,
        },
        {
          path: "4",
          children: [],
          component: 4 as any,
        },
      ],
      redirect: "/1",
    } satisfies RouteRecordRaw);
  });
});
