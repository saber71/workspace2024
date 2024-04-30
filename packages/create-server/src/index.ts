import {
  AuthorizedGuard,
  Server,
  type ServerBootstrapOption,
  type ServerCreateOption,
  type ServerRuntimeAdapter,
  WHITE_LIST,
} from "server";
import { SERVER_LOG_COLLECTION } from "server-log-decorator";
import { ServerStore, type StoreAdapter } from "server-store";

export async function createServer<PlatformInstance extends object>(
  option: CreateServerOption<PlatformInstance>,
): Promise<Server<PlatformInstance>> {
  if (!option.guards) option.guards = [AuthorizedGuard];
  const app = await Server.create(option);
  app.dependencyInjection
    .bindInstance(await ServerStore.create(option.storeAdapter))
    .bindInstance(option.runtime)
    .bindValue(WHITE_LIST, option.whiteList ?? []);
  if (option.log) {
    app.dependencyInjection.bindValue(
      SERVER_LOG_COLLECTION,
      option.log.serverLogCollection,
    );
  }
  app.bootstrap(option.bootstrapOption);
  return app as any;
}

export * from "server";
export * from "server-store";
export * from "server-log-decorator";

export interface CreateServerOption<PlatformInstance extends object>
  extends ServerCreateOption<PlatformInstance> {
  contextName: string;

  runtime: ServerRuntimeAdapter;

  storeAdapter: StoreAdapter;

  whiteList?: string[];

  log?: {
    serverLogCollection: string;
  };

  bootstrapOption?: ServerBootstrapOption;
}
