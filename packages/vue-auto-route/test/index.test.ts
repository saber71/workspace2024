import { expect, test } from "vitest";
import { RouteRecordRaw } from "vue-router";
import { autoRoutes } from "../src";

test("vue-auto-route:autoRoutes", () => {
  const routes = autoRoutes(
    {
      "./view1.ts": 1,
      "./view2-p2-view.ts": 2,
      "./view/view4.ts": 4,
      "./view/view3-p3.view.ts": 3,
      "./view2/empty/view5.home.ts": 5,
    },
    ".",
  );
  expect(routes).toEqual({
    path: "/",
    redirect: "/view2/empty/view5",
    children: [
      {
        path: "view1",
        name: "View1",
        component: 1 as any,
        children: [],
      },
      {
        path: "view2-p2-view",
        name: "View2P2View",
        component: 2 as any,
        children: [],
      },
      {
        path: "view",
        children: [
          {
            path: "view3-p3",
            name: "View3P3",
            component: 3 as any,
            children: [],
          },
          {
            path: "view4",
            name: "View4",
            component: 4 as any,
            children: [],
          },
        ],
      },
      {
        path: "view2",
        children: [
          {
            path: "empty",
            children: [
              {
                path: "view5",
                name: "View5",
                component: 5 as any,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  } satisfies RouteRecordRaw);
});
