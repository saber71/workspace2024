import {
  Controller,
  Get,
  NotFoundObjectError,
  Post,
  ReqBody,
  ReqQuery,
  ReqSession,
  Session,
} from "server";
import { Collection, StoreCollection } from "server-store";
import validator from "validator";
import { COLLECTION_ROLE, COLLECTION_USER } from "../constants";
import { CreateUserDTO, LoginDTO, QueryDTO } from "../dto";

@Controller({ routePrefix: "/user" })
export class UserController {
  /**
   * 根据id查找User对象
   * @throws NotFoundObjectError 当根据id找不到User对象时抛出
   */
  @Get()
  async findById(
    @ReqQuery() query: QueryDTO,
    @Collection(COLLECTION_USER) collection: StoreCollection<UserModel>,
  ): Promise<UserModel> {
    const user = await collection.getById(query.id);
    if (!user) throw new NotFoundObjectError(`找不到id为${query.id}的Role对象`);
    return user;
  }

  /**
   * 新建用户
   * @throws NotFoundObjectError 当找不到roleId对应的Role对象时抛出
   */
  @Post()
  create(
    @ReqBody() data: CreateUserDTO,
    @Collection(COLLECTION_USER) collection: StoreCollection<UserModel>,
    @Collection(COLLECTION_ROLE) roleCollection: StoreCollection<RoleModel>,
  ) {
    return collection.transaction(async () => {
      if (!(await roleCollection.getById(data.roleId)))
        throw new NotFoundObjectError(
          "找不到roleId为" + data.roleId + "的Role对象",
        );
      return await collection.add({
        ...data,
        userData: data.putUserData ?? {},
        createTime: Date.now(),
      });
    });
  }

  /**
   * 登陆，设置用户id进session中
   * @throws Error 当找不到用户或密码错误时抛出
   */
  @Post()
  login(
    @ReqBody() data: LoginDTO,
    @ReqSession() session: Session<RegularSessionData>,
    @Collection(COLLECTION_USER) collection: StoreCollection<UserModel>,
  ) {
    return collection.transaction(async () => {
      const is_email = validator.isEmail(data.loginNameOrEmail);
      let user;
      if (is_email) {
        user = await collection.searchOne({
          email: data.loginNameOrEmail,
          password: data.password,
        });
      } else {
        user = await collection.searchOne({
          loginName: data.loginNameOrEmail,
          password: data.password,
        });
      }
      if (!user) throw new Error("找不到用户或密码错误");
      session.set("userId", user._id);
    });
  }

  /**
   * 退出登陆
   */
  @Post()
  async logout(@ReqSession() session: Session<RegularSessionData>) {
    session.deleteKey("userId");
  }
}
