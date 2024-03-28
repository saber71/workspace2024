import { Injectable, ToArray, ToBoolean, Validation } from "server";

export class QueryDTO {
  @Validation({ validatorType: "isString" })
  id: string;
}

export class CreateRoleDTO {
  @Validation({ validatorType: "isString" })
  name: string;

  @Validation({ validatorType: "isObject" })
  authorizations: RoleModel["authorizations"];
}

export class UpdateRoleDTO {
  @Validation({ validatorType: "isString" })
  id: string;

  @Validation({ validatorType: "isBoolean", allowUndefined: true })
  @ToBoolean()
  toDelete?: boolean;

  @Validation({ validatorType: "isString", allowUndefined: true })
  name?: string;

  @Validation({ validatorType: "isObject", allowUndefined: true })
  putAuthorizations?: RoleModel["authorizations"];

  @Validation({ validatorType: "isArray", allowUndefined: true })
  @ToArray(String)
  deleteAuthorizations?: string[];
}

export class CreateUserDTO {
  @Validation({ validatorType: "isString", allowUndefined: true })
  _id: UserModel["_id"];

  @Validation({ validatorType: "isString" })
  name: UserModel["name"];

  @Validation({ validatorType: "isString" })
  loginName: UserModel["loginName"];

  @Validation<"isLength">({ validatorType: "isLength", arg: { min: 1 } })
  password: UserModel["password"];

  @Validation({ validatorType: "isTruthy" })
  @Validation({ validatorType: "isString" })
  roleId: UserModel["roleId"];

  @Validation({ validatorType: "isEmail", allowUndefined: true })
  email?: string;

  @Validation<"isURL">({
    validatorType: "isURL",
    allowUndefined: true,
    arg: { require_host: false },
  })
  avatar?: string;

  @Validation({ validatorType: "isObject", allowUndefined: true })
  putUserData?: UserModel["userData"];
}

@Injectable({ overrideParent: false })
export class UpdateUserDTO extends CreateUserDTO {
  @Validation({ validatorType: "isString" })
  id: UserModel["_id"];

  @Validation({ validatorType: "isArray", allowUndefined: true })
  @ToArray(String)
  deleteUserData?: string[];

  @Validation({ validatorType: "isBoolean", allowUndefined: true })
  @ToBoolean()
  toDelete?: boolean;
}

export class LoginDTO {
  @Validation({ validatorType: "isString" })
  loginNameOrEmail: string;

  @Validation({ validatorType: "isString" })
  password: string;
}
