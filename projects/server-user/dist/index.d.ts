export declare function bootstrap(port: number): Promise<void>;

export declare class CreateRoleDTO {
    name: string;
    authorizations: RoleModel["authorizations"];
}

export declare class CreateUserDTO {
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
