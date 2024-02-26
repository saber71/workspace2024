import { Container, LoadableContainer, Metadata } from "dependency-injection";
import { ServerError, getOrCreateMetadataUserData } from "./common";
import { DEFAULT_PORT, MODULE_NAME, SERVER_LABEL } from "./constant";
import { RouteHandler } from "./route-handler";

export class Server<PlatformInstance extends object = object> {
  /* 创建Server对象 */
  static async create(serverPlatform: ServerPlatformAdapter) {
    const app = new Server(serverPlatform);
    await app._init();
    return app;
  }

  private constructor(
    /* Web框架的适配器 */
    private readonly _serverPlatform: ServerPlatformAdapter<PlatformInstance>,
  ) {}

  /* 路由路径映射RouteHandler */
  private readonly _routeHandlerMap = new Map<string, RouteHandler>();

  /* 依赖注入的容器 */
  private readonly _dependencyInjection = new LoadableContainer();

  /* Web框架的实例 */
  private _platformInstance: PlatformInstance;

  /* 返回Web框架的实例 */
  get platformInstance(): PlatformInstance {
    return this._platformInstance;
  }

  /* 创建一个依赖注入容器，并且继承自Server内部保有的根容器 */
  createContainer(): Container {
    return new Container().extend(this._dependencyInjection);
  }

  /* 启动服务器 */
  async bootstrap(option: ServerBootstrapOption = {}) {
    if (!option.port) option.port = DEFAULT_PORT;
    this._serverPlatform.bootstrap(option);
  }

  /**
   * 根据请求的path获取对应的路由处理对象
   * @throws NotFountRouteHandlerError 找不到路由处理对象时抛出
   */
  getRouteHandler(path: string) {
    const routeHandler = this._routeHandlerMap.get(path);
    if (!routeHandler)
      throw new NotFountRouteHandlerError(
        `找不到path ${path} 对应的RouteHandler对象`,
      );
    return routeHandler;
  }

  /* 初始化Web服务器 */
  private async _init() {
    this._dependencyInjection
      .bindValue(SERVER_LABEL, this)
      .bindFactory(Container.name, this.createContainer.bind(this));
    this._platformInstance = await this._serverPlatform.create();
    this._dependencyInjection.load({ moduleName: MODULE_NAME });
    const controllerMetadataArray = Array.from(
      Metadata.getAllMetadata(),
    ).filter(
      (item) => getOrCreateMetadataUserData(item.clazz).__server__isController,
    );
    for (let metadata of controllerMetadataArray) {
      const userData = getOrCreateMetadataUserData(metadata.clazz);
      for (let methodName in userData.__server__controllerMethods) {
        const controllerMethod =
          userData.__server__controllerMethods[methodName];
        const path =
          "/" +
          [
            removeHeadTailSlash(userData.__server__controllerRoutePrefix),
            removeHeadTailSlash(controllerMethod.routePrefix),
            removeHeadTailSlash(controllerMethod.route),
          ]
            .filter((item) => !!item)
            .join("/");
        this._routeHandlerMap.set(
          path,
          new RouteHandler(
            this._dependencyInjection.getValue(metadata.clazz),
            controllerMethod.methodName,
          ),
        );
      }
    }
  }
}

/* 删除头尾的斜线 */
function removeHeadTailSlash(str: string) {
  while (str[0] === "/") str = str.slice(1);
  while (str[str.length - 1] === "/") str = str.slice(0, str.length - 1);
  return str;
}

/* 当根据请求的path找不到RouteHandler对象时抛出 */
export class NotFountRouteHandlerError extends ServerError {}
