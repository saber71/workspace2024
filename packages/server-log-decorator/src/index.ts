import {
  AfterCallMethod,
  type Container,
  ServerRequest,
  Session,
} from "server";
import { ServerStore, type StoreItem } from "server-store";

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
      container.getValue(Session).get("userId");
  return AfterCallMethod((container, metadata, returnValue, args, error) => {
    if (error) return returnValue;
    if (container.hasLabel(SERVER_LOG_COLLECTION)) {
      const collectionName = container.getValue<string>(SERVER_LOG_COLLECTION);
      const creator = options.creatorGetter(container);
      const request = container.getValue(ServerRequest);
      const store = container.getValue<ServerStore>(ServerStore.name);
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
        createTime: Date.now(),
      });
    }
    return returnValue;
  });
}

export interface LogModel extends StoreItem {
  creator: string;
  createTime: number;
  description: string;
  query: any;
  body: any;
  url: string;
  data?: any;
}
