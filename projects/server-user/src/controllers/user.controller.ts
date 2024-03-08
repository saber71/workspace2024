import {
  Controller,
  Method,
  NotFoundObjectError,
  ReqQuery,
  Session,
} from "server";
import { isEmail } from "validator";
import { CreateUserDTO, LoginDTO, QueryDTO } from "../dto";
import { RoleModel, UserModel } from "../models";

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

  /**
   * 新建用户
   * @throws NotFoundObjectError 当找不到roleId对应的Role对象时抛出
   */
  @Method({ type: "POST" })
  async create(data: CreateUserDTO) {
    if (!RoleModel.exists({ _id: data.roleId }))
      throw new NotFoundObjectError(
        "找不到roleId为" + data.roleId + "的Role对象",
      );
    const userData = data.putUserData ?? {};
    userData._ = true;
    const user = new UserModel({
      ...data,
      userData,
    });
    await user.save();
    return user.id;
  }

  /**
   * 登陆，设置用户id进session中
   * @throws Error 当找不到用户或密码错误时抛出
   */
  @Method({ type: "POST" })
  async login(data: LoginDTO, session: Session<RegularSessionData>) {
    const is_email = isEmail(data.loginNameOrEmail);
    let user;
    if (is_email) {
      user = await UserModel.findOne({
        email: data.loginNameOrEmail,
        password: data.password,
      });
    } else {
      user = await UserModel.findOne({
        loginName: data.loginNameOrEmail,
        password: data.password,
      });
    }
    if (!user) throw new Error("找不到用户或密码错误");
    session.set("userId", user.id);
  }

  /**
   * 退出登陆
   */
  @Method({ type: "POST" })
  async logout(session: Session<RegularSessionData>) {
    session.deleteKey("userId");
  }
}
