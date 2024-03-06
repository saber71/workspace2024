import { Controller, Method, NotFoundObjectError, ReqQuery } from "server";
import { QueryDTO } from "../dto";
import { UserModel } from "../models";

@Controller({ routePrefix: "/user" })
export class UserController {
  /**
   * 根据id查找User对象
   * @throws NotFoundObjectError 当根据id找不到User对象时抛出
   */
  @Method()
  async findById(@ReqQuery() query: QueryDTO) {
    const user = await UserModel.findById(query.id);
    if (!user) throw new NotFoundObjectError(`找不到id为${query.id}的Role对象`);
    return user.toObject();
  }

  @Method({ type: "POST" })
  async create() {}
}
