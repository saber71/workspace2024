// @ts-ignore
import { app as ServerUser } from "server-user/index.browser.js";
import axios from "axios";

const servers = {
  "/server-user": ServerUser,
};

axios.defaults.adapter = async (config) => {
  for (let prefix in servers) {
    if (prefix === config.baseURL) {
      const app = (servers as any)[prefix].platformInstance;
      const result = await app.apply(config.url, {
        headers: config.headers,
        body: config.data,
        method: config.method!.toUpperCase(),
      });
      console.log(result);
      return {
        config,
        headers: result.headers,
        data: result.data,
        status: result.status,
        statusText: "",
      };
    }
  }
  return {
    config,
    headers: {},
    data: null,
    status: 404,
    statusText: "Not found",
  };
};
