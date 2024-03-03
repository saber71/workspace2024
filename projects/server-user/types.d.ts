/// <reference types="server/types"/>

declare interface UserModel {
  id: string;
  /* 显示名 */
  name: string;
  /* 登陆名 */
  loginName: string;
  password: string;
  email?: string;
  avatar?: string;
  userData: Record<string, any>;
}
