import type { Container } from "dependency-injection";
import {
  PARAMTYPES_REQUEST,
  PARAMTYPES_REQUEST_BODY,
  PARAMTYPES_REQUEST_QUERY,
  PARAMTYPES_RESPONSE,
  PARAMTYPES_SESSION,
  SERVER_LABEL,
} from "./constant";
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
      .bindValue(PARAMTYPES_REQUEST, request)
      .bindValue(PARAMTYPES_RESPONSE, response)
      .bindValue(PARAMTYPES_REQUEST_QUERY, request.query)
      .bindValue(PARAMTYPES_REQUEST_BODY, request.body)
      .bindGetter(PARAMTYPES_SESSION, () => new Session(request, response))
      .bindGetter(Session.name, () => new Session(request, response));
  }

  start() {
    try {
      const server = this.container.getValue(SERVER_LABEL) as Server;
      const routeHandler = server.getRouteHandler(this.request.path);
      routeHandler.call(this.container);
    } catch (e) {}
  }

  dispose() {
    this.container.dispose();
  }
}
