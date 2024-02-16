import { autoRoutes } from "vue-auto-route";
import { createRouter, createWebHashHistory } from "vue-router";

const route = await autoRoutes(
  import.meta.glob("@/views/**/*.(view|layout).tsx"),
  "/src/views",
);
console.log(route);

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [route],
});
