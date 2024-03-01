import {
  ErrorHandler,
  NotFoundRouteHandlerError,
  ServerError,
  ServerRequest,
  ServerResponse,
} from "../../src";

@ErrorHandler(NotFoundRouteHandlerError)
export class NotFoundRouteHandlerErrorHandler
  implements ErrorHandlerInterface<NotFoundRouteHandlerError>
{
  handle(
    err: NotFoundRouteHandlerError,
    _: ServerResponse,
    req: ServerRequest,
  ): any {}
}

@ErrorHandler(ServerError)
export class ServerErrorHandler implements ErrorHandlerInterface<ServerError> {
  handle(err: ServerError, _: ServerResponse, req: ServerRequest): any {}
}
