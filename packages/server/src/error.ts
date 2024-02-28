import { ServerError } from "./common";
import { ErrorHandler } from "./decorator";
import type { ServerResponse } from "./response";

@ErrorHandler(ServerError)
export class ServerErrorHandler implements ErrorHandler<ServerError> {
  handle(err: ServerError, res: ServerResponse): void | Promise<void> {
    res.statusCode = 500;
    res.body(err.message);
  }
}
