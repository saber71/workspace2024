/// <reference types="dependency-injection/types"/>

/* 上传的文件类型 */
declare interface ServerFile {
  /**
   * The size of the uploaded file in bytes. If the file is still being uploaded (see `'fileBegin'`
   * event), this property says how many bytes of the file have been written to disk yet.
   */
  size: number;

  /**
   * The path this file is being written to. You can modify this in the `'fileBegin'` event in case
   * you are unhappy with the way formidable generates a temporary path for your files.
   */
  filepath: string;

  /**
   * The name this file had according to the uploading client.
   */
  originalFilename: string | null;

  /**
   * Calculated based on options provided
   */
  newFilename: string;
}

/* Web框架适配器，比如适配express、koa等 */
declare interface ServerPlatformAdapter<
  PlatformInstance extends object = object,
> {
  /* Web框架名字 */
  readonly name: string;

  /* 实例化Web框架 */
  create(): Promise<PlatformInstance>;

  /* 应用路由。需要由Web框架适配器来实现ServerRequest和ServerResponse对象 */
  useRoutes(
    routes: Record<
      string,
      {
        handle: (
          req: import("src").ServerRequest,
          res: import("src").ServerResponse,
        ) => any;
        catchError: (
          err: Error,
          req: import("src").ServerRequest,
          res: import("src").ServerResponse,
        ) => void;
      }
    >,
  ): void;

  /**
   * 支持静态资源，可多次调用
   * @param assetsPath 静态资源的文件家路径
   * @param routePathPrefix 访问静态资源的路由前缀
   */
  staticAssets(assetsPath: string, routePathPrefix: string): void;

  /* 启动Web框架 */
  bootstrap(option: ServerBootstrapOption): void;

  /* 配置代理转发 */
  proxy(option: {
    src: string;
    target: string;
    changeOrigin?: boolean;
    // key is regex
    rewrites?: Record<string, string>;
  }): void;
}

/* 服务器的启动参数 */
declare interface ServerBootstrapOption {
  /* 服务监听的端口 */
  port?: number;

  /* 服务器主机名 */
  hostname?: string;

  /* 配置session */
  session?: {
    /* 用来加密session的key */
    secretKey?: string;

    /* session保存在cookie的key名 */
    cookieKey?: string;

    /* session的有效时间 */
    maxAge?: number;
  };
}

declare interface ControllerMethod {
  methodType: MethodType;
  methodName: string;
  routePrefix: string;
  route: string;
  paramtypes: Record<number, string>;
}

declare interface MetadataServerUserData {
  __server__: boolean;
  __server__isController: boolean;
  __server__metadata: import("dependency-injection").Metadata;
  __server__routePrefix: string;
  __server__controllerMethods: Record<string, ControllerMethod>;
}

declare type MethodType = "GET" | "POST" | "PUT" | "DELETE";
