import { RegularSessionData } from 'create-server';
import { Server } from 'create-server';
import { ServerStore } from 'create-server';
import { Session } from 'create-server';
import { StoreCollection } from 'create-server';
import { StoreItem } from 'create-server';

export declare const COLLECTION_ROLE = "role";

export declare const COLLECTION_USER = "user";

export declare function createDefaultData(app: Server, store: ServerStore): Promise<void>;

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

export declare interface RoleModel extends StoreItem {
    name: string;
    authorizations: Record<string, boolean>;
    createTime: number;
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
    login(data: LoginDTO, session: Session<RegularSessionData>, userCollection: StoreCollection<UserModel>, roleCollection: StoreCollection<RoleModel>): Promise<UserInfo>;
    logout(session: Session<RegularSessionData>): Promise<void>;
    auth(session: Session<RegularSessionData>, userCollection: StoreCollection<UserModel>, roleCollection: StoreCollection<RoleModel>): Promise<UserInfo>;
    updateUserData(data: UpdateUserDataDTO, collection: StoreCollection<UserModel>): Promise<void>;
}

export declare interface UserInfo extends Omit<UserModel, "password">, Pick<RoleModel, "authorizations"> {
}

export declare interface UserModel extends StoreItem {
    name: string;
    loginName: string;
    password: string;
    roleId: string;
    email?: string;
    avatar?: string;
    userData: Record<string, any>;
    createTime: number;
}

export { }
