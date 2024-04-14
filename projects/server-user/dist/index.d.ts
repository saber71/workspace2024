/// <reference types="../types.d.ts" />

import { JwtSession } from 'server';
import { StoreCollection } from 'server-store';

export declare function bootstrap(port: number, saveOnExit?: boolean, log?: boolean): Promise<void>;

export declare const COLLECTION_ROLE = "role";

export declare const COLLECTION_USER = "user";

export declare const CONTEXT_NAME = "server-user";

export declare class CreateRoleDTO {
    name: string;
    authorizations: RoleModel["authorizations"];
}

export declare class CreateUserDTO {
    _id: UserModel["_id"];
    name: UserModel["name"];
    loginName: UserModel["loginName"];
    password: UserModel["password"];
    roleId: UserModel["roleId"];
    email?: string;
    avatar?: string;
    putUserData?: UserModel["userData"];
}

export declare class LoginDTO {
    loginNameOrEmail: string;
    password: string;
}

export declare class QueryDTO {
    id: string;
}

export declare class RoleController {
    create(body: CreateRoleDTO, collection: StoreCollection<RoleModel>): Promise<string[]>;
    /**
     * 更新Role对象，如果toDelete为true时则删除对象不做其他更新
     * @throws NotFoundObjectError 当根据id找不到Role对象时抛出
     */
    update(body: UpdateRoleDTO, collection: StoreCollection<RoleModel>): Promise<void>;
    findById(query: QueryDTO, collection: StoreCollection<RoleModel>): Promise<RoleModel>;
}

export declare class UpdateRoleDTO {
    id: string;
    toDelete?: boolean;
    name?: string;
    putAuthorizations?: RoleModel["authorizations"];
    deleteAuthorizations?: string[];
}

export declare class UpdateUserDataDTO {
    id: UserModel["_id"];
    deleteUserData?: string[];
    appendUserData?: Record<string, any>;
}

export declare class UpdateUserDTO extends CreateUserDTO {
    id: UserModel["_id"];
    deleteUserData?: string[];
    toDelete?: boolean;
}

export declare class UserController {
    findById(query: QueryDTO, collection: StoreCollection<UserModel>): Promise<UserModel>;
    /**
     * 新建用户
     * @throws NotFoundObjectError 当找不到roleId对应的Role对象时抛出
     */
    create(data: CreateUserDTO, collection: StoreCollection<UserModel>, roleCollection: StoreCollection<RoleModel>): Promise<string[]>;
    login(data: LoginDTO, session: JwtSession<RegularSessionData>, userCollection: StoreCollection<UserModel>, roleCollection: StoreCollection<RoleModel>): Promise<UserInfo>;
    logout(session: JwtSession<RegularSessionData>): Promise<void>;
    auth(session: JwtSession<RegularSessionData>, userCollection: StoreCollection<UserModel>, roleCollection: StoreCollection<RoleModel>): Promise<UserInfo>;
    updateUserData(data: UpdateUserDataDTO, collection: StoreCollection<UserModel>): Promise<void>;
}

export { }
