import type { StoreItem } from "create-server";

export interface UserModel extends StoreItem {
  /* 显示名 */
  name: string;
  /* 登陆名 */
  loginName: string;
  password: string;
  roleId: string;
  email?: string;
  avatar?: string;
  userData: Record<string, any>;
  createTime: number;
}

export interface RoleModel extends StoreItem {
  name: string;
  /* key为权限名，value为是否获得授权 */
  authorizations: Record<string, boolean>;
  createTime: number;
}

export interface UserInfo
  extends Omit<UserModel, "password">,
    Pick<RoleModel, "authorizations"> {}
