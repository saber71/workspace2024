import { Container } from "dependency-injection";
import { DEFAULT_PORT, MODULE_NAME } from "./constant";

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

  /* 依赖注入的容器 */
  private readonly _dependencyInjection = new Container();

  /* Web框架的实例 */
  private _platformInstance: PlatformInstance;

  /* 返回Web框架的实例 */
  get platformInstance(): PlatformInstance {
    return this._platformInstance;
  }

  /* 启动服务器 */
  async bootstrap(option: ServerBootstrapOption = {}) {
    if (!option.port) option.port = DEFAULT_PORT;
    this._serverPlatform.bootstrap(option);
  }

  /* 初始化Web服务器 */
  private async _init() {
    this._platformInstance = await this._serverPlatform.create();
    this._dependencyInjection.load({ moduleName: MODULE_NAME });
  }
}
