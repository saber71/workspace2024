import { ROUTER } from "@/constant.ts";
import LoginView from "@/views/login.view.tsx";
import { message } from "ant-design-vue";
import axios, { type AxiosResponse } from "axios";
import { ServerApiProvider } from "server-api-provider";
import serverUserJson from "server-user/dist/provider.json";
import serverLogJson from "server-log/dist/provider.json";
import type { UserController, RoleController } from "server-user";
import type { Controller as LogController } from "server-log";
import { VueClass } from "vue-class";
import type { Router } from "vue-router";

const serverUserApiProvider = new ServerApiProvider(
  serverUserJson as any,
  createAxiosInstance("/server-user"),
);
const serverLogApiProvider = new ServerApiProvider(
  serverLogJson as any,
  createAxiosInstance("/server-log"),
);

export const userApi =
  serverUserApiProvider.provider<UserController>("UserController");
export const roleApi =
  serverUserApiProvider.provider<RoleController>("RoleController");
export const logApi =
  serverLogApiProvider.provider<LogController>("Controller");

function createAxiosInstance(baseURL: string) {
  const instance = axios.create({
    baseURL,
    validateStatus: () => true,
  });
  instance.interceptors.response.use(
    (res: AxiosResponse<ResponseBody<any>>) => {
      const body = res.data ?? {};
      if (!body.success) {
        message.error(body.msg || "操作失败");
        if (body.code === 401) {
          const router = VueClass.dependencyInjection.getValue(
            ROUTER,
          ) as Router;
          router.push({
            name: LoginView.name,
            params: { redirect: router.currentRoute.value.fullPath },
          });
        }
      }
      return res;
    },
  );
  return instance;
}
