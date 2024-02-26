import type { Container } from "dependency-injection";
import {
  PARAMTYPES_REQUEST,
  PARAMTYPES_REQUEST_BODY,
  PARAMTYPES_REQUEST_QUERY,
  PARAMTYPES_RESPONSE,
  PARAMTYPES_SESSION,
} from "./constant";
import { ControllerCaller } from "./controller-caller";
import { Pipeline } from "./decorator";
import { ServerRequest } from "./request";
import { ServerResponse } from "./response";
import { Session } from "./session";

@Pipeline()
export class RequestPipeline {
  constructor(
    readonly container: Container,
    readonly request: ServerRequest,
    readonly response: ServerResponse,
    readonly controllerCaller: ControllerCaller,
  ) {
    this.container
      .bindValue(ServerRequest.name, request)
      .bindValue(ServerResponse.name, response)
      .bindValue(ControllerCaller.name, controllerCaller)
      .bindValue(PARAMTYPES_REQUEST, request)
      .bindValue(PARAMTYPES_RESPONSE, response)
      .bindValue(PARAMTYPES_REQUEST_QUERY, request.query)
      .bindValue(PARAMTYPES_REQUEST_BODY, request.body)
      .bindGetter(PARAMTYPES_SESSION, () => new Session(request, response))
      .bindGetter(Session.name, () => new Session(request, response));
  }

  dispose() {
    this.container
      .unbind(ServerRequest.name)
      .unbind(ServerResponse.name)
      .unbind(PARAMTYPES_REQUEST)
      .unbind(PARAMTYPES_RESPONSE)
      .unbind(PARAMTYPES_REQUEST_QUERY)
      .unbind(PARAMTYPES_REQUEST_BODY)
      .unbind(PARAMTYPES_SESSION)
      .unbind(Session.name);
  }
}
