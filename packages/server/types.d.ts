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

/* 创建Server对象时传入的选项 */
declare interface ServerCreateOption<PlatformInstance extends object> {
  /* 上下文环境名。默认server */
  contextName?: string;

  /* Web框架适配器 */
  serverPlatformAdapter: ServerPlatformAdapter<PlatformInstance>;

  runtime: ServerRuntimeAdapter;

  /* 用来处理日志 */
  loggers?: Class<LoggerInterface>[];

  /* 是否输出日志内容到控制台。默认true */
  consoleLogger?: boolean;

  /* 路由守卫集合 */
  guards?: Class<GuardInterface>[];
}

declare type RouteHandlerObject = {
  handle: (
    req: import("src").ServerRequest,
    res: import("src").ServerResponse,
  ) => any;
  catchError: (
    err: Error,
    req: import("src").ServerRequest,
    res: import("src").ServerResponse,
  ) => void | Promise<void>;
  methodTypes: Set<MethodType>;
};

declare type Routes = Record<string, RouteHandlerObject>;

/* Web框架适配器，比如适配express、koa等 */
declare interface ServerPlatformAdapter<
  PlatformInstance extends object = object,
> {
  /* Web框架名字 */
  readonly name: string;

  /* 实例化Web框架 */
  create(): Promise<PlatformInstance>;

  /* 应用路由。需要由Web框架适配器来实现ServerRequest和ServerResponse对象 */
  useRoutes(routes: Routes): void;

  /**
   * 支持静态资源，可多次调用
   * @param assetsPath 静态资源的文件夹路径
   * @param routePathPrefix 访问静态资源的路由前缀
   */
  staticAssets(assetsPath: string, routePathPrefix: string): void;

  /* 启动Web框架 */
  bootstrap(option: ServerBootstrapOption): void;

  /* 配置代理转发 */
  proxy(option: ServerProxyOption): void;
}

/* 代理转发配置 */
declare interface ServerProxyOption {
  /* 源地址 */
  src: string;

  /* 转发地址 */
  target: string;

  /* 转发时是否修改请求头中的origin字段 */
  changeOrigin?: boolean;

  /* 转发前替换url，key是正则表达式，value是要替换的内容 */
  rewrites?: Record<string, string>;
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

    /* session的有效时间 */
    maxAge?: number | string;
  };
}

/* 保存控制器的方法中的路由 */
declare interface ControllerMethod {
  /* 方法类型 */
  type: MethodType;

  /* 方法名 */
  methodName: string;

  /* 路由前缀 */
  routePrefix: string;

  /* 该方法所对应的路由。完整的路由要再加上路由前缀 */
  route: string;
}

/* 类的类型 */
declare type ServerClassType = "no-special" | "controller" | "parser" | "guard";

/* 保存类的自定义数据。挂在类的元数据上 */
declare interface MetadataServerUserData {
  /* 标记自定义数据是否初始化完成 */
  __server__: boolean;

  __server__classType: ServerClassType;

  /* 控制器下的所有方法共同的路由前缀 */
  __server__controllerRoutePrefix: string;

  /* 保存控制器下需要被映射到路由的方法。方法名为key */
  __server__controllerMethods: Record<string, ControllerMethod>;

  /* 错误处理器所能处理的错误类型 */
  __server__handle_error_type: Class<Error>;

  __server__propParseToType: Record<string, Array<Class | undefined | null>>;
}

/* 请求类型 */
declare type MethodType = "GET" | "POST" | "PUT" | "DELETE";

/* 一条路由下，请求类型映射一个控制器方法 */
declare type RouteHandlerSet = Partial<
  Record<MethodType, RouteHandler | undefined>
>;

/* 保存处理一条路由对应的控制器方法 */
declare interface RouteHandler {
  controllerClass: Class;
  methodName: string;
}

/* 处理请求后发送内容 */
declare interface ResponseBodySenderInterface {
  send(value: any, res: import("src").ServerResponse): void | Promise<void>;
}

/* 用来转化数据，如将对象中的字符串转为number/boolean或反过来 */
declare interface ParserInterface {
  parse(value: any, ...clazz: Array<Class | undefined | null>): any;
}

/* 配置转化器和验证器 */
declare interface ParserAndValidator {
  parsers?: Class<ParserInterface> | Class<ParserInterface>[] | null;
  validator?: boolean;
}

declare type MethodParameterOptions = ParserAndValidator & {
  typeValueGetter: (container: import("dependency-injection").Container) => any;
  afterExecute?: (
    metadata: import("dependency-injection").Metadata,
    className: string,
    ...args: Array<string | number>
  ) => void;
};

/* 日志等级 */
declare type LogLevel =
  | "log"
  | "error"
  | "warn"
  | "debug"
  | "verbose"
  | "fatal"
  | string;

/* 处理日志相关 */
declare interface LoggerInterface {
  log(
    level: LogLevel,
    message: string | Error | import("src").ServerRequest,
  ): void;
}

/* 在执行路由对应的方法前执行，如果请求不合法可以抛出错误打断请求流程 */
declare interface GuardInterface {
  /* 调用时，入参将会通过依赖注入获取，所以该方法必须用Inject装饰 */
  guard(...args: any[]): void | Promise<void>;
}

/* 内置的响应体格式 */
declare interface ResponseBody<T = undefined> {
  code: number;
  object: T;
  success: boolean;
  msg: string;
}

/* 内置的session数据格式 */
declare interface RegularSessionData {
  userId: string;
}

/* 用于生成Provider的元数据 */
declare interface ProviderMetadata {
  [controllerClassName: string]: {
    [methodName: string]: {
      type: MethodType;
      url: string;
      parameters: Array<
        | undefined
        | {
            isQuery?: boolean;
            isBody?: boolean;
            isFile?: string;
            isFiles?: string;
            isSession?: boolean;
            isReq?: boolean;
            isRes?: boolean;
          }
      >;
    };
  };
}

declare type MethodOptions = Partial<
  Pick<ControllerMethod, "route" | "routePrefix" | "type">
> &
  MethodParameterOption;

declare type WithoutTypeMethodOptions = Omit<MethodOptions, "type">;

declare interface ServerRuntimeAdapter {
  fs: typeof import("node:fs/promises");
  path: typeof import("node:path");
}
