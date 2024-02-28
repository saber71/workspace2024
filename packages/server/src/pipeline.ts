import { Container } from "dependency-injection";
import { SERVER_LABEL } from "./constant";
import { Pipeline } from "./decorator";
import { ServerRequest } from "./request";
import { ServerResponse } from "./response";
import type { Server } from "./server";
import { Session } from "./session";

@Pipeline()
export class RequestPipeline {
  constructor(
    readonly container: Container,
    readonly request: ServerRequest,
    readonly response: ServerResponse,
  ) {
    this.container
      .bindValue(ServerRequest.name, request)
      .bindValue(ServerResponse.name, response)
      .bindGetter(Session.name, () => new Session(request, response));
  }

  start() {
    try {
      const server = this.container.getValue(SERVER_LABEL) as Server;
      const routeHandler = server.getRouteHandler(this.request.path);
      this.container.call(
        routeHandler.controller as any,
        routeHandler.methodName,
      );
    } catch (e) {}
  }

  dispose() {
    this.container.dispose();
  }
}
