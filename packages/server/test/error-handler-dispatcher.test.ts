import { ServerResponse } from "node:http";
import { describe, expect, test } from "vitest";
import {
  DuplicateRouteHandlerError,
  ErrorHandler,
  ErrorHandlerDispatcher,
  NotFoundRouteHandlerError,
  ServerError,
  ServerRequest,
} from "../src";

@ErrorHandler(NotFoundRouteHandlerError)
class ErrorHandler1
  implements ErrorHandlerInterface<NotFoundRouteHandlerError>
{
  handle(
    err: NotFoundRouteHandlerError,
    _: ServerResponse,
    req: ServerRequest,
  ): any {}
}

@ErrorHandler(ServerError)
class ErrorHandler2 implements ErrorHandlerInterface<ServerError> {
  handle(
    err: NotFoundRouteHandlerError,
    _: ServerResponse,
    req: ServerRequest,
  ): any {}
}

describe("ErrorHandlerDispatcher", () => {
  test("dispatch", () => {
    const dispatcher1 = new ErrorHandlerDispatcher([
      ErrorHandler1,
      ErrorHandler2,
    ]);
    const dispatcher2 = new ErrorHandlerDispatcher([
      ErrorHandler2,
      ErrorHandler1,
    ]);

    expect(dispatcher1.dispatch(new NotFoundRouteHandlerError())).toEqual(
      ErrorHandler1,
    );
    expect(dispatcher1.dispatch(new DuplicateRouteHandlerError())).toEqual(
      ErrorHandler2,
    );
    expect(dispatcher1.dispatch(new Error())).toBeUndefined();
    expect(dispatcher2.dispatch(new NotFoundRouteHandlerError())).toEqual(
      ErrorHandler2,
    );
  });
});
