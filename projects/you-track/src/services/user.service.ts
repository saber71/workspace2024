import type { CommonService } from "@/services/common.service.ts";
import {
  type IndexDBService,
  type Tables,
} from "@/services/indexDB.service.ts";
import type { KeyValueService } from "@/services/key-value.service.ts";
import { useGlobalStore } from "@/store.ts";
import { Service } from "vue-class";
import { InjectService } from "@/services/index.ts";

@Service({ singleton: true, createOnLoad: true })
export class UserService {
  constructor(
    @InjectService("IndexDBService")
    readonly indexedRepository: IndexDBService,
    @InjectService("CommonService")
    readonly commonService: CommonService,
    @InjectService("KeyValueService")
    readonly keyValueService: KeyValueService,
  ) {
    const store = useGlobalStore();
    if (!store.rememberLoginStatus) store.lastLoginUserId = "";
  }

  /* 重置用户的密码，找不到用户时抛出错误 */
  async resetPassword(data: ResetPasswordData) {
    const user = await this.fetchByLoginNameOrEmail(data.loginNameOrEmail);
    user.password = data.password;
    await this.indexedRepository.user.put(user);
  }

  /* 用户登陆 */
  async login(loginData: LoginData) {
    const user = await this.fetchByLoginData(loginData);
    const store = useGlobalStore();
    store.rememberLoginStatus = loginData.remember;
    await this.auth(user);
  }

  /* 游客登陆 */
  async guestLogin() {
    const guestId = await this.keyValueService.fetchValue("GuestID");
    const user = await this.fetchById(guestId);
    await this.auth(user);
  }

  /* 用户登陆后执行，获取用户数据 */
  async auth(user: Tables.User) {
    const store = useGlobalStore();
    store.lastLoginUserId = user.id;
    store.userInfo = user;
    store.auth = true;
  }

  /* 新建用户 */
  async create(userData: CreateUserData) {
    const repeatLoginName = !!(await this.indexedRepository.user.searchOne(
      (item) => item.loginName === userData.loginName,
    ));
    if (repeatLoginName) throw new Error("登录名重复");
    const user: Omit<Tables.User, "id"> = {
      ...userData,
      createTime: new Date(),
    };
    return this.indexedRepository.user.add(user as any);
  }

  /* 通过id获取用户，找不到用户时抛出错误 */
  async fetchById(id: string) {
    const user = await this.indexedRepository.user.getById(id);
    if (!user) throw new Error(`找不到id ${id} 对应的用户`);
    return user;
  }

  /* 通过登录名或邮箱获取用户，找不到用户时抛出错误 */
  async fetchByLoginNameOrEmail(value: string) {
    const isEmail = this.commonService.isEmail(value);
    const user = await this.indexedRepository.user.searchOne((user) =>
      isEmail ? user.email === value : user.loginName === value,
    );
    if (!user) throw new Error("找不到用户");
    return user;
  }

  /* 通过登陆数据获取用户，找不到用户时抛出错误 */
  async fetchByLoginData(data: Omit<LoginData, "remember">) {
    const user = await this.fetchByLoginNameOrEmail(data.loginNameOrEmail);
    if (user.password !== data.password) throw new Error("密码不正确");
    return user;
  }
}

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
