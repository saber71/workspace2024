import AppComponent from "@/app.component.tsx";
import { RouterKey } from "@/constant.ts";
import { router } from "@/routes.ts";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import "./style.css";
import "ant-design-vue/dist/reset.css";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import { createApp } from "vue";
import { VueClass } from "vue-class";

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

const app = createApp(AppComponent).use(createPinia()).use(Antd);

await VueClass.install(
  app,
  router,
  Object.assign(
    {},
    import.meta.glob("@/services/**/*.service.ts"),
    import.meta.glob("@/router/**/*.guard.ts"),
    import.meta.glob("@/views/**/*.(view|layout).tsx"),
  ),
);

// 挂载至页面上
app.use(router).provide(RouterKey, router).mount("#app");
