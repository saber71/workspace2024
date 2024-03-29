import axios from "axios";
import { AfterCallMethod, Container, Session } from "server";
import { SERVER_LOG_ADDRESS } from "./constants";

export function ServerLog(
  description: string,
  options: {
    creatorGetter?: (container: Container) => string;
    data?: any | (() => any);
  } = {},
) {
  if (!options.creatorGetter)
    options.creatorGetter = (container) =>
      container.getValue(Session).get("userId");
  return AfterCallMethod((container) => {
    const creator = options.creatorGetter!(container);
    const serverLogAddress = container.getValue(SERVER_LOG_ADDRESS);
    axios.post(serverLogAddress + "/log/create", {
      creator,
      description,
      data: typeof options.data === "function" ? options.data() : options.data,
    });
  });
}
