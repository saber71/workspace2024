/// <reference types="server/types"/>

declare interface UserModel {
  _id: string;
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

declare interface RoleModel {
  _id: string;
  name: string;
  /* key为权限名，value为是否获得授权 */
  authorizations: Record<string, boolean>;
  createTime: number;
}
