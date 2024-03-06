import { Container } from "dependency-injection";
import { Pipeline } from "./decorators";
import { ServerRequest } from "./request";
import { ServerResponse } from "./response";
import { RouteManager } from "./route-manager";
import { Server } from "./server";
import { Session } from "./session";

/* 用来处理请求的管道 */
@Pipeline()
export class RequestPipeline {
  constructor(
    readonly server: Server,
    readonly request: ServerRequest,
    readonly response: ServerResponse,
  ) {
    this._container = server.createContainer();
    this._container
      .bindValue(Container.name, this._container)
      .bindValue(ServerRequest.name, request)
      .bindValue(ServerResponse.name, response)
      .bindGetter(Session.name, () => new Session(request, response));
  }

  /* 依赖注入容器 */
  private readonly _container: Container;

  /* 启动管道，开始处理请求 */
  async start() {
    const responseBodySender = this.server.responseBodySender;
    let result: any;
    try {
      for (let guardClass of this.server.guardClasses) {
        const guard = this._container.getValue(guardClass);
        await this._container.call(guard, "guard");
      }
      const routeHandler = RouteManager.getRouteHandler(
        this.request.method,
        this.request.path,
      );
      result = await this._container.call(
        this._container.getValue(routeHandler.controllerClass),
        routeHandler.methodName,
      );
    } catch (e) {
      this.server.log((e as any).logLevel || "error", e as Error);
      result = e;
      const errorHandlerClass = this.server.errorHandlerDispatcher.dispatch(
        e as Error,
      );
      if (errorHandlerClass) {
        const errorHandler = this._container.getValue(errorHandlerClass);
        result = await errorHandler.handle(
          e as Error,
          this.response,
          this.request,
        );
      }
    }
    return responseBodySender.send(result, this.response);
  }

  /* 销毁管道 */
  dispose() {
    this._container.dispose();
  }
}
