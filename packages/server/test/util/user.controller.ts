import { httpTest } from "http-test";
import { expect } from "vitest";
import { Controller, Get, Method, ReqQuery, ToNumber } from "../../src";

class QueryDTO {
  @ToNumber()
  id: number;
}

@Controller({ routePrefix: "/user" })
export class UserController {
  @Get({ routePrefix: "/api" })
  findById(
    //@ts-ignore
    @ReqQuery() query: QueryDTO,
  ) {
    return { id: query.id };
  }

  /* 不要请求这个，这是为了测试方法参数的依赖注入 */
  @Method({ routePrefix: "/post/", route: "/postData", type: "POST" })
  postData(arg: string) {
    expect(arg).toEqual("arg");
    return 1;
  }
}

export function userControllerHttpTestSuits() {
  return httpTest({
    url: "/user/api/find-by-id",
    params: {
      id: 12,
    },
  })
    .expectHeader("Content-Type", /json/)
    .expectStatus(200)
    .expectBody({
      success: true,
      code: 200,
      object: { id: 12 },
      msg: "ok",
    })
    .done();
}
