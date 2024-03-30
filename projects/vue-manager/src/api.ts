import { ServerApiProvider } from "server-api-provider";
import serverUserJson from "server-user/dist/provider.json";
import serverLogJson from "server-log/dist/provider.json";
import type { UserController, RoleController } from "server-user";
import type { Controller as LogController } from "server-log";

const serverUserApiProvider = new ServerApiProvider(serverUserJson as any);
const serverLogApiProvider = new ServerApiProvider(serverLogJson as any);

export const userApi =
  serverUserApiProvider.provider<UserController>("UserController");
export const roleApi =
  serverUserApiProvider.provider<RoleController>("RoleController");
export const logApi =
  serverLogApiProvider.provider<LogController>("Controller");
