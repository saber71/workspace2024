import { Container, LoadableContainer } from "dependency-injection";
import { CONTEXT_LABEL, DEFAULT_PORT, MODULE_NAME, RUNTIME } from "./constant";
import { ConsoleLogger } from "./logger";
import { ResponseBodyImpl } from "./response-body";
import { RouteManager } from "./route-manager";
import { RequestPipeline } from "./pipeline";
import { ServerRequest } from "./request";
import { ServerResponse } from "./response";

export class Server<PlatformInstance extends object = object> {
  /* 创建Server对象 */
  static async create(options: ServerCreateOption) {
    const app = new Server(options.serverPlatformAdapter);
    await app._init(options);
    return app;
  }

  private constructor(
    /* Web框架的适配器 */
    private readonly _serverPlatform: ServerPlatformAdapter<PlatformInstance>,
  ) {}

  /* 依赖注入的容器 */
  private readonly _dependencyInjection = new LoadableContainer();
  get dependencyInjection(): Container {
    return this._dependencyInjection;
  }

  /* Web框架的实例 */
  private _platformInstance: PlatformInstance;
  get platformInstance(): PlatformInstance {
    return this._platformInstance;
  }

  /* 用来处理日志的Logger类集合 */
  private readonly _loggerClasses: Array<Class<LoggerInterface>> = [];

  /* 路由守卫类的集合 */
  private readonly _guardClasses: Array<Class<GuardInterface>> = [];
  get guardClasses(): ReadonlyArray<Class<GuardInterface>> {
    return this._guardClasses;
  }

  /* 输出日志 */
  log(logLevel: LogLevel, message: string | Error | ServerRequest) {
    for (let loggerClass of this._loggerClasses) {
      const logger = this._dependencyInjection.getValue(loggerClass);
      logger.log(logLevel, message);
    }
  }

  /* 创建一个依赖注入容器，并且继承自Server内部保有的根容器 */
  createContainer(): Container {
    return new LoadableContainer().extend(this._dependencyInjection);
  }

  /* 启动服务器 */
  bootstrap(option: ServerBootstrapOption = {}) {
    if (!option.port) option.port = DEFAULT_PORT;
    this._serverPlatform.bootstrap(option);
    this.log("log", `启动成功，监听端口${option.port}`);
  }

  /**
   * 支持静态资源
   * @param assetsPath 静态资源的文件夹路径
   * @param routePathPrefix 访问静态资源的路由前缀
   */
  staticAssets(assetsPath: string, routePathPrefix: string) {
    this._serverPlatform.staticAssets(assetsPath, routePathPrefix);
    return this;
  }

  /* 配置代理转发 */
  proxy(option: ServerProxyOption) {
    this._serverPlatform.proxy(option);
    return this;
  }

  /* 处理请求 */
  async handleRequest(request: ServerRequest, response: ServerResponse) {
    this.log("log", request);
    const pipeline = new RequestPipeline(this, request, response);
    await pipeline.start();
    pipeline.dispose();
  }

  /* 初始化Web服务器 */
  private async _init(
    options: Omit<ServerCreateOption, "serverPlatformAdapter">,
  ) {
    this._dependencyInjection
      .bindValue(Server.name, this)
      .bindFactory(Container.name, this.createContainer.bind(this))
      .bindValue(RUNTIME, options.runtime)
      .bindValue(
        CONTEXT_LABEL,
        (options.contextName || "server") + ":" + this._serverPlatform.name,
      )
      .load({ moduleName: MODULE_NAME });
    if (options.consoleLogger !== false)
      this._loggerClasses.push(ConsoleLogger);
    if (options.loggers) this._loggerClasses.push(...options.loggers);
    if (options.guards) this._guardClasses.push(...options.guards);
    this._setupRoutes();
    this._platformInstance = await this._serverPlatform.create();
  }

  /* 给Web框架设置路由 */
  private _setupRoutes() {
    const urls = RouteManager.getUrls();
    const routes: Routes = {};
    for (let url of urls) {
      routes[url] = {
        handle: this.handleRequest.bind(this),
        catchError: this._catchRequestError.bind(this),
        methodTypes: RouteManager.getMethodTypes(url),
      };
    }
    this._serverPlatform.useRoutes(routes);
  }

  /* 处理请求中的错误 */
  private _catchRequestError(
    err: Error,
    _: ServerRequest,
    response: ServerResponse,
  ) {
    this.log((err as any).logLevel || "error", err);
    return ResponseBodyImpl.from(err).send(response);
  }
}
