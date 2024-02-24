import Dexie from 'dexie';
import type { Table } from 'dexie';

export declare namespace CommonService {
    export function setup(option: {
        databaseName: string;
        tableNames: Array<keyof IndexdbTableMap>;
        userStore: UseUserStore;
    }): void;
}

declare class CommonService_2 {
    isEmail(value: string): boolean;
}

export declare interface CreateUserData extends Omit<Tables.User, "createTime" | "id"> {
    id?: string;
}

export declare class IndexDBService extends Dexie {
    readonly databaseName: string;
    readonly tableNames: Array<keyof IndexdbTableMap>;
    constructor(databaseName: string, tableNames: Array<keyof IndexdbTableMap>);
    private readonly _indexdbTableMap;
    getTable<Key extends keyof IndexdbTableMap>(key: Key): IndexdbTableMap[Key];
}

export declare class KeyValueNotFoundError extends Error {
}

export declare class KeyValueReadonlyError extends Error {
}

export declare class KeyValueService<KeyValueMap extends Record<string, any> = Record<string, any>> {
    readonly indexedRepository: IndexDBService;
    constructor(indexedRepository: IndexDBService);
    readonly dexieTable: Table<Tables.KeyValue>;
    getValue<Key extends keyof KeyValueMap>(key: Key): Promise<KeyValueMap[Key] | undefined>;
    fetchValue<Key extends keyof KeyValueMap>(key: Key): Promise<KeyValueMap[Key]>;
    setValue<Key extends keyof KeyValueMap>(key: Key, value: KeyValueMap[Key], readonly?: boolean): Promise<void>;
}

export declare interface LoginData {
    loginNameOrEmail: string;
    password: string;
    remember: boolean;
}

export declare interface ResetPasswordData {
    loginNameOrEmail: string;
    password: string;
}

export declare class UserNotFoundError extends Error {
}

export declare class UserRepeatLoginNameError extends Error {
}

export declare class UserService {
    readonly indexedRepository: IndexDBService;
    readonly commonService: CommonService_2;
    readonly keyValueService: KeyValueService;
    readonly userStore: UseUserStore;
    constructor(indexedRepository: IndexDBService, commonService: CommonService_2, keyValueService: KeyValueService, userStore: UseUserStore);
    resetPassword(data: ResetPasswordData): Promise<void>;
    login(loginData: LoginData): Promise<void>;
    guestLogin(): Promise<void>;
    auth(user: Tables.User | string): Promise<void>;
    create(userData: CreateUserData): Promise<string>;
    fetchById(id: string): Promise<Tables.User>;
    fetchByLoginNameOrEmail(value: string): Promise<Tables.User>;
    fetchByLoginData(data: Omit<LoginData, "remember">): Promise<Tables.User>;
}

export declare class UserWrongPasswordError extends Error {
}

export declare interface UseUserStore {
    userInfo: Tables.User & {
        profile: Tables.UserProfile;
    };
    rememberLoginStatus: boolean;
    loggedInUserId: string;
    auth: boolean;
}

export { }
