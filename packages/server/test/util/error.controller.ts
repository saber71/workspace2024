import { httpTest } from "http-test";
import { Controller, Method, ServerError } from "../../src";

@Controller({ routePrefix: "/error" })
export class ErrorController {
  @Method({ type: "DELETE" })
  throwError() {
    const error = new ServerError("An error has occurred.");
    error.code = 666;
    throw error;
  }
}

export function errorControllerHttpTestSuits() {
  return httpTest({
    url: "http://localhost:4000/error/throw-error",
    method: "DELETE",
  })
    .expectStatus(666)
    .expectBody({
      success: true,
      code: 666,
      object: {},
      msg: "An error has occurred.",
    })
    .done();
}
