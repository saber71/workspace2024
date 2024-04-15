///<reference types="server/types.d.ts"/>

declare interface App {
  runtime: ServerRuntimeAdapter;
  apply(url: string, option?: AppApplyOption): Promise<any>;
}

declare interface AppApplyOption {
  headers?: any;
  body?: any;
  method?: MethodType;
}

declare interface UrlOption {
  type: "route" | "assets" | "proxy";
  filePath?: string;
  routeHandler?: RouteHandlerObject;
  proxy?: ServerProxyOption;
}
