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

/* 本库封装的请求对象，抹除不同框架的请求对象的不同 */
declare interface ServerRequest<Original extends object = object> {
  /* Web框架的原请求对象 */
  readonly original: Original;

  /* 读取session内容 */
  readonly session: Readonly<Record<string, any>> | null;

  /* 请求头 */
  readonly headers: import("node:http").IncomingHttpHeaders;

  /* 请求体内容 */
  readonly body: any;

  /* 上传的文件 */
  readonly files: Record<string, ServerFile | ServerFile[]> | undefined;

  /* Get request URL. */
  readonly url: string;

  /**
   * Get origin of URL.
   */
  readonly origin: string;

  /**
   * Get full request URL.
   */
  readonly href: string;

  /**
   * Get request method.
   */
  readonly method: string;

  /**
   * Get request pathname.
   * Set pathname, retaining the query-string when present.
   */
  readonly path: string;

  /**
   * Get parsed query-string.
   * Set query-string as an object.
   */
  readonly query: import("node:querystring").ParsedUrlQuery;

  /**
   * Get query string.
   */
  readonly querystring: string;

  /**
   * Get the search string. Same as the querystring
   * except it includes the leading ?.
   */
  readonly search: string;

  /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  readonly host: string;

  /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */
  readonly hostname: string;

  /**
   * Get WHATWG parsed URL object.
   */
  readonly URL: import("node:url").URL;
}

/* 本库封装的响应对象，抹除不同框架的响应对象的不同 */
declare interface ServerResponse<Original extends object = object> {
  /* Web框架的原响应对象 */
  readonly original: Original;

  /* 响应头 */
  readonly headers: import("node:http").OutgoingHttpHeaders;

  /* 更新session内容 */
  session: Record<string, any> | null;

  /* 状态码 */
  statusCode: number;

  /* 发送响应体 */
  body(value?: any): void;

  /* 发送文件 */
  sendFile(filePath: string): Promise<void>;

  /* 重定向 */
  redirect(url: string): void;
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
        handle: (req: ServerRequest, res: ServerResponse) => any;
        catchError: (
          err: Error,
          req: ServerRequest,
          res: ServerResponse,
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
