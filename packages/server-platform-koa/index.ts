import { ServerResponse } from "node:http";
import {
  Controller,
  Method,
  ReqQuery,
  RouteManager,
  Server,
  ServerRequest,
  Session,
} from "server";
import { createServerPlatformKoa } from "./src";

@Controller()
class Controller1 {
  @Method()
  findById(
    req: ServerRequest,
    res: ServerResponse,
    session: Session<any>,
    //@ts-ignore
    @ReqQuery()
    query: any,
  ) {
    //@ts-ignore
    delete (req as any).original;
    console.log(req, query);
    return { name: "abc" };
  }
}

Server.create({
  serverPlatformAdapter: createServerPlatformKoa(),
}).then((app) => {
  app.bootstrap();
  console.log("bootstrap server platform-koa");
});
