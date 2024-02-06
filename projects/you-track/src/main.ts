import AppComponent from "@/app.component.tsx";
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

const app = createApp(AppComponent).use(createPinia()).use(Antd).use(router);

await VueClass.install(app, {});

// 挂载至页面上
app.mount("#app");
