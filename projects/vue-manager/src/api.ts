import { useUser } from "@/stores";
import { ROUTER } from "vue-class";
import LoginView from "@/views/login.view.tsx";
import { message } from "ant-design-vue";
import axios, { type AxiosResponse } from "axios";
import { ServerApiProvider } from "server-api-provider";
import serverUserJson from "server-user/dist/provider.json";
import type { UserController, RoleController } from "server-user";
import { VueClass } from "vue-class";
import type { Router } from "vue-router";

const serverUserApiProvider = new ServerApiProvider(
  serverUserJson as any,
  createAxiosInstance("/server-user"),
);

export const userApi =
  serverUserApiProvider.provider<UserController>("UserController");
export const roleApi =
  serverUserApiProvider.provider<RoleController>("RoleController");

function createAxiosInstance(baseURL: string) {
  const tokenKey = "Authorized";
  const instance = axios.create({
    baseURL,
    validateStatus: () => true,
  });
  instance.interceptors.request.use((req) => {
    const userStore = useUser();
    req.headers[tokenKey] = userStore.token;
    return req;
  });
  instance.interceptors.response.use(
    (res: AxiosResponse<ResponseBody<any>>) => {
      const userStore = useUser();
      userStore.token = res.headers.authorized;
      const body = res.data ?? {};
      if (!body.success) {
        message.error(body.msg || "操作失败");
        if (body.code === 401) {
          const userStore = useUser();
          userStore.isAuth = false;
          userStore.info._id = "";
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
