import {
  Controller,
  Get,
  NotFoundObjectError,
  Post,
  ReqBody,
  ReqQuery,
  ReqSession,
  Session,
  UnauthorizedError,
} from "server";
import { Collection, StoreCollection } from "server-store";
import validator from "validator";
import { COLLECTION_ROLE, COLLECTION_USER } from "../constants";
import { CreateUserDTO, LoginDTO, QueryDTO, UpdateUserDataDTO } from "../dto";
import { ServerLog } from "server-log-decorator";

@Controller({ routePrefix: "/user" })
export class UserController {
  @ServerLog("根据id查找User对象")
  @Get()
  async findById(
    @ReqQuery() query: QueryDTO,
    @Collection(COLLECTION_USER) collection: StoreCollection<UserModel>,
  ): Promise<UserModel> {
    const user = await collection.getById(query.id);
    if (!user) throw new NotFoundObjectError(`找不到id为${query.id}的User对象`);
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

  @ServerLog("登陆")
  @Post()
  login(
    @ReqBody() data: LoginDTO,
    @ReqSession() session: Session<RegularSessionData>,
    @Collection(COLLECTION_USER) userCollection: StoreCollection<UserModel>,
    @Collection(COLLECTION_ROLE) roleCollection: StoreCollection<RoleModel>,
  ): Promise<UserInfo> {
    return userCollection.transaction(async () => {
      const is_email = validator.isEmail(data.loginNameOrEmail);
      let user;
      if (is_email) {
        user = await userCollection.searchOne({
          email: data.loginNameOrEmail,
          password: data.password,
        });
      } else {
        user = await userCollection.searchOne({
          loginName: data.loginNameOrEmail,
          password: data.password,
        });
      }
      if (!user) throw new NotFoundObjectError("找不到用户或密码错误");
      session.set("userId", user._id);
      return await this.auth(session, userCollection, roleCollection);
    });
  }

  @ServerLog("退出登陆")
  @Post()
  async logout(@ReqSession() session: Session<RegularSessionData>) {
    session.destroy();
  }

  @ServerLog("获取用户数据")
  @Get()
  async auth(
    @ReqSession() session: Session<RegularSessionData>,
    @Collection(COLLECTION_USER) userCollection: StoreCollection<UserModel>,
    @Collection(COLLECTION_ROLE) roleCollection: StoreCollection<RoleModel>,
  ): Promise<UserInfo> {
    const userId = session.get("userId");
    if (!userId) throw new UnauthorizedError();
    const user = await userCollection.getById(userId);
    if (user?.roleId) {
      const role = await roleCollection.getById(user.roleId);
      if (!role) throw new UnauthorizedError("用户未配置角色");
      return {
        ...user,
        //@ts-ignore
        password: undefined,
        authorizations: role.authorizations,
      } satisfies UserInfo;
    } else throw new UnauthorizedError();
  }

  @ServerLog("更新用户的自定义数据")
  @Post()
  async updateUserData(
    @ReqBody() data: UpdateUserDataDTO,
    @Collection(COLLECTION_USER) collection: StoreCollection<UserModel>,
  ) {
    const user = await this.findById({ id: data.id }, collection);
    if (data.appendUserData) Object.assign(user.userData, data.appendUserData);
    if (data.deleteUserData)
      data.deleteUserData.forEach((key) => delete user.userData[key]);
    await collection.update(user);
  }
}
