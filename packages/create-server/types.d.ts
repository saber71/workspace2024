///<reference types="server/types.d.ts"/>
///<reference types="server-log-decorator/types.d.ts"/>
///<reference types="server-store/types.d.ts"/>

declare interface CreateServerOption<PlatformInstance extends object>
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
