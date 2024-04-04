///<reference types="../types.d.ts"/>
import axios from "axios";
import {
  AfterCallMethod,
  type Container,
  ServerRequest,
  Session,
} from "server";

export const SERVER_LOG_ADDRESS = "server-log-address";

export function ServerLog(
  description: string,
  options: {
    creatorGetter?: any | ((container: import("server").Container) => any);
    data?: any | ((container: import("server").Container) => any);
  } = {},
) {
  if (!options.creatorGetter)
    options.creatorGetter = (container: Container) =>
      container.getValue(Session).get("userId");
  return AfterCallMethod((container, metadata, returnValue, args, error) => {
    if (error) return returnValue;
    if (container.hasLabel(SERVER_LOG_ADDRESS)) {
      const creator = options.creatorGetter(container);
      const request = container.getValue(ServerRequest);
      const serverLogAddress = container.getValue(SERVER_LOG_ADDRESS);
      axios.post(serverLogAddress + "/log/create", {
        creator,
        description,
        query: request.query,
        body: request.body,
        url: request.url,
        data:
          typeof options.data === "function"
            ? options.data(container)
            : options.data,
      });
    }
    return returnValue;
  });
}
