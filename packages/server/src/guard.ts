import { Inject } from "dependency-injection";
import { WHITE_LIST } from "./constant";
import { Guard, ReqSession } from "./decorators";
import { UnauthorizedError } from "./errors";
import { ServerRequest } from "./request";
import { Session } from "./session";

@Guard()
export class AuthorizedGuard implements GuardInterface {
  @Inject()
  guard(
    @ReqSession() session: Session<RegularSessionData>,
    @Inject({ typeLabel: WHITE_LIST })
    whiteList: string[],
    req: ServerRequest,
  ): void | Promise<void> {
    if (whiteList.length === 0 || whiteList.includes("*")) return;
    if (whiteList.includes(req.path)) return;
    if (!session.get("userId"))
      throw new UnauthorizedError("未登录或登陆信息已过期");
  }
}
