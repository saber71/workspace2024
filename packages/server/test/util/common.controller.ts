import { httpTest } from "http-test";
import { Controller, Method, ReqBody, Session } from "../../src";

@Controller()
export class CommonController {
  @Method()
  setSession(session: Session<any>) {
    session.set("id", 20);
  }

  @Method({ type: "POST" })
  testPost(
    //@ts-ignore
    @ReqBody() body: any,
  ) {
    return body;
  }
}

export function commonControllerHttpTestSuits() {
  return Promise.all([
    httpTest({
      method: "GET",
      url: "/set-session",
    })
      .expectHasHeader("set-cookie")
      .done(),
    httpTest({
      method: "POST",
      url: "/test-post",
      data: {
        id: 12,
        name: "Test Post",
      },
    })
      .expectBodyData({
        id: 12,
        name: "Test Post",
      })
      .done(),
  ]);
}
