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

/* 保存控制器的方法中的路由 */
declare interface ControllerMethod {
  /* 方法类型 */
  methodType: MethodType;

  /* 方法名 */
  methodName: string;

  /* 路由前缀 */
  routePrefix: string;

  /* 该方法所对应的路由。完整的路由要再加上路由前缀 */
  route: string;
}

/* 保存类的自定义数据。挂在类的元数据上 */
declare interface MetadataServerUserData {
  /* 标记自定义数据是否初始化完成 */
  __server__: boolean;

  /* 挂载该自定义数据的元数据对象 */
  __server__metadata: import("dependency-injection").Metadata;

  /* 标识给类是否是错误处理器 */
  __server__isErrorHandler: boolean;

  /* 标识该类是否是控制器 */
  __server__isController: boolean;

  /* 标识该类是否是管道 */
  __server__isPipeline: boolean;

  /* 控制器下的所有方法共同的路由前缀 */
  __server__controllerRoutePrefix: string;

  /* 保存控制器下需要被映射到路由的方法。方法名为key */
  __server__controllerMethods: Record<string, ControllerMethod>;

  /* 错误处理器所能处理的错误类型 */
  __server__handle_error_type: Class<Error>;
}

/* 请求类型 */
declare type MethodType = "GET" | "POST" | "PUT" | "DELETE";

/* 错误处理器。单例 */
declare interface ErrorHandler<Err extends Error> {
  handle(
    err: Err,
    res: import("src").ServerResponse,
    req: import("src").ServerRequest,
  ): void | Promise<void>;
}

/* 一条路由下，请求类型映射一个控制器方法 */
declare type RouteHandlerSet = Partial<
  Record<MethodType, RouteHandler | undefined>
>;

/* 保存处理一条路由对应的控制器方法 */
declare interface RouteHandler {
  controllerClass: Class;
  methodName: string;
}
