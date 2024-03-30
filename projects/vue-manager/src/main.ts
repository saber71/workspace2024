import "ant-design-vue/dist/reset.css";
import App from "@/App.vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import antd from "ant-design-vue";
import { autoRoutes } from "vue-auto-route";
import { VueClass } from "vue-class";
import { createRouter, createWebHashHistory } from "vue-router";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

const app = createApp(App).use(antd).use(createPinia());
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    await autoRoutes(
      import.meta.glob("@/views/**/*.(view|layout).tsx"),
      "/src/views",
    ),
  ],
});

await VueClass.install(app, router);

VueClass.dependencyInjection.bindInstance(router);

// 挂载至页面上
app.use(router).provide(router.constructor.name, router).mount("#app");
