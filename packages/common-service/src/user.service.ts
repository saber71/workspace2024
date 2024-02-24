import { IoC } from "ioc";
import { Service } from "vue-class";
import type { CommonService } from "./common.service";
import type { IndexDBService } from "./indexDB.service";
import type { KeyValueService } from "./key-value.service";

export interface UseUserStore {
  userInfo: Tables.User & { profile: Tables.UserProfile };
  rememberLoginStatus: boolean;
  loggedInUserId: string;
  auth: boolean;
}

@Service({ singleton: true, createOnLoad: true })
export class UserService {
  constructor(
    @IoC.Inject<ServiceLabel>("IndexDBService")
    readonly indexedRepository: IndexDBService,
    @IoC.Inject<ServiceLabel>("CommonService")
    readonly commonService: CommonService,
    @IoC.Inject<ServiceLabel>("KeyValueService")
    readonly keyValueService: KeyValueService,
    @IoC.Inject<ServiceLabel>("UseUserStore")
    readonly userStore: UseUserStore,
  ) {}

  /* 重置用户的密码，找不到用户时抛出错误 */
  async resetPassword(data: ResetPasswordData) {
    const user = await this.fetchByLoginNameOrEmail(data.loginNameOrEmail);
    user.password = data.password;
    await this.indexedRepository.getTable("user").put(user);
  }

  /* 用户登陆 */
  async login(loginData: LoginData) {
    const user = await this.fetchByLoginData(loginData);
    this.userStore.rememberLoginStatus = loginData.remember;
    await this.auth(user);
  }

  /* 游客登陆 */
  async guestLogin() {
    const guestId = await this.keyValueService.fetchValue("GuestID");
    const user = await this.fetchById(guestId);
    await this.auth(user);
  }

  /* 用户登陆后执行，获取用户数据 */
  async auth(user: Tables.User | string) {
    if (typeof user === "string") user = await this.fetchById(user);
    this.userStore.loggedInUserId = user.id;
    this.userStore.userInfo = {
      ...user,
      profile: (await this.indexedRepository
        .getTable("userProfile")
        .getById(user.id))!,
    };
    this.userStore.auth = true;
  }

  /* 新建用户 */
  async create(userData: CreateUserData) {
    const repeatLoginName = !!(await this.indexedRepository
      .getTable("user")
      .searchOne((item) => item.loginName === userData.loginName));
    if (repeatLoginName) throw new UserRepeatLoginNameError("登录名重复");
    const user: Omit<Tables.User, "id"> = {
      ...userData,
      createTime: new Date(),
    };
    const userId = await this.indexedRepository
      .getTable("user")
      .add(user as any);
    return this.indexedRepository.getTable("userProfile").add({
      id: userId,
      avatar: undefined,
      name: "",
    });
  }

  /* 通过id获取用户，找不到用户时抛出错误 */
  async fetchById(id: string) {
    const user = await this.indexedRepository.getTable("user").getById(id);
    if (!user) throw new UserNotFoundError(`找不到id ${id} 对应的用户`);
    return user;
  }

  /* 通过登录名或邮箱获取用户，找不到用户时抛出错误 */
  async fetchByLoginNameOrEmail(value: string) {
    const isEmail = this.commonService.isEmail(value);
    const user = await this.indexedRepository
      .getTable("user")
      .searchOne((user) =>
        isEmail ? user.email === value : user.loginName === value,
      );
    if (!user) throw new UserNotFoundError("找不到用户");
    return user;
  }

  /* 通过登陆数据获取用户，找不到用户时抛出错误 */
  async fetchByLoginData(data: Omit<LoginData, "remember">) {
    const user = await this.fetchByLoginNameOrEmail(data.loginNameOrEmail);
    if (user.password !== data.password)
      throw new UserWrongPasswordError("密码不正确");
    return user;
  }
}

export class UserNotFoundError extends Error {}

export class UserWrongPasswordError extends Error {}

export class UserRepeatLoginNameError extends Error {}

export interface CreateUserData extends Omit<Tables.User, "createTime" | "id"> {
  id?: string;
}

export interface LoginData {
  loginNameOrEmail: string;
  password: string;
  remember: boolean;
}

export interface ResetPasswordData {
  loginNameOrEmail: string;
  password: string;
}
