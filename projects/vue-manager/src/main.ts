import "./styles/tailwind.css";
import "./styles/ant-design.scss";
import "ant-design-vue/dist/reset.css";
import App from "@/App.vue";
import { ROUTE_RECORDS } from "@/constant.ts";
import { createPinia } from "pinia";
import { createApp } from "vue";
import antd from "ant-design-vue";
import { autoRoutes } from "vue-auto-route";
import { VueClass } from "vue-class";
import { createRouter, createWebHistory } from "vue-router";
import "./guards";
import "./components/desktop";

const routeRecords = await autoRoutes(
  import.meta.glob("@/views/**/*.(view|layout).(tsx|ts)"),
  "/src/views",
);

const app = createApp(App).use(antd).use(createPinia());
const router = createRouter({
  history: createWebHistory(),
  routes: [routeRecords],
});

await VueClass.install(app, router);

VueClass.dependencyInjection.bindValue(ROUTE_RECORDS, routeRecords);

app.use(router).mount("#app");
///<reference types="../types"/>
