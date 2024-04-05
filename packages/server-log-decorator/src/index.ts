///<reference types="../types.d.ts"/>
import {
  AfterCallMethod,
  type Container,
  JwtSession,
  ServerRequest,
} from "server";
import { ServerStore } from "server-store";

export const SERVER_LOG_COLLECTION = "server-log-collection";

export function ServerLog(
  description: string,
  options: {
    creatorGetter?: any | ((container: import("server").Container) => any);
    data?: any | ((container: import("server").Container) => any);
  } = {},
) {
  if (!options.creatorGetter)
    options.creatorGetter = (container: Container) =>
      container.getValue(JwtSession).get("userId");
  return AfterCallMethod((container, metadata, returnValue, args, error) => {
    if (error) return returnValue;
    if (container.hasLabel(SERVER_LOG_COLLECTION)) {
      const collectionName = container.getValue(SERVER_LOG_COLLECTION);
      const creator = options.creatorGetter(container);
      const request = container.getValue(ServerRequest);
      const store = container.getValue(ServerStore);
      const collection = store.collection<LogModel>(collectionName);
      collection.add({
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
