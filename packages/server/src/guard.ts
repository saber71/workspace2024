import { Inject } from "dependency-injection";
import { WHITE_LIST } from "./constant";
import { Guard, ReqJwtSession, ReqSession } from "./decorators";
import { UnauthorizedError } from "./errors";
import { ServerRequest } from "./request";
import { JwtSession, Session } from "./session";

@Guard()
export class AuthorizedGuard implements GuardInterface {
  @Inject()
  guard(
    @ReqSession() session: Session<RegularSessionData>,
    @ReqJwtSession() jwtSession: JwtSession<RegularSessionData>,
    @Inject(WHITE_LIST)
    whiteList: string[],
    req: ServerRequest,
  ): void | Promise<void> {
    if (whiteList.length === 0 || whiteList.includes("*")) return;
    if (whiteList.includes(req.path)) return;
    if (!jwtSession.get("userId") && !session.get("userId"))
      throw new UnauthorizedError();
  }
}
