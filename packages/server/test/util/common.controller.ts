import { httpTest } from "http-test";
import { Controller, Method, Session } from "../../src";

@Controller()
export class CommonController {
  @Method()
  setSession(session: Session<any>) {
    session.set("id", 20);
  }
}

export function commonControllerHttpTestSuits() {
  return httpTest({
    method: "GET",
    url: "/set-session",
  })
    .expectHasHeader("set-cookie")
    .done();
}
