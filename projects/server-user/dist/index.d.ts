export declare function bootstrap(port: number, saveOnExit?: boolean): Promise<void>;

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

export declare class UpdateRoleDTO {
    id: string;
    toDelete?: boolean;
    name?: string;
    putAuthorizations?: RoleModel["authorizations"];
    deleteAuthorizations?: string[];
}

export declare class UpdateUserDTO extends CreateUserDTO {
    id: UserModel["_id"];
    deleteUserData?: string[];
    toDelete?: boolean;
}

export { }
