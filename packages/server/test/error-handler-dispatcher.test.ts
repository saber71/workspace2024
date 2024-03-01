import { describe, expect, test } from "vitest";
import {
  DuplicateRouteHandlerError,
  ErrorHandlerDispatcher,
  NotFoundRouteHandlerError,
} from "../src";
import {
  NotFoundRouteHandlerErrorHandler,
  ServerErrorHandler,
} from "./util/error-handler";

describe("ErrorHandlerDispatcher", () => {
  test("dispatch", () => {
    const dispatcher1 = new ErrorHandlerDispatcher([
      NotFoundRouteHandlerErrorHandler,
      ServerErrorHandler,
    ]);
    const dispatcher2 = new ErrorHandlerDispatcher([
      ServerErrorHandler,
      NotFoundRouteHandlerErrorHandler,
    ]);

    expect(dispatcher1.dispatch(new NotFoundRouteHandlerError())).toEqual(
      NotFoundRouteHandlerErrorHandler,
    );
    expect(dispatcher1.dispatch(new DuplicateRouteHandlerError())).toEqual(
      ServerErrorHandler,
    );
    expect(dispatcher1.dispatch(new Error())).toBeUndefined();
    expect(dispatcher2.dispatch(new NotFoundRouteHandlerError())).toEqual(
      ServerErrorHandler,
    );
  });
});
