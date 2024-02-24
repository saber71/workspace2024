declare namespace Tables {
  export interface KeyValue {
    key: string;
    value: any;
    readonly: boolean;
  }

  export interface User {
    readonly id: string;
    loginName: string;
    email: string;
    password: string;
    createTime: Date;
  }

  export interface UserProfile {
    readonly id: string;
    name?: string;
    avatar?: Blob;
  }
}

declare type ServiceLabel =
  | "DatabaseName"
  | "TableNames"
  | "IndexDBService"
  | "CommonService"
  | "UserService"
  | "KeyValueService"
  | "UseUserStore"
  | keyof IndexdbTableMap;

declare type IndexdbTableMap = {
  keyValue: import("indexdb-table").IndexDBTable<Tables.KeyValue>;
  user: import("indexdb-table").IndexDBTable<Tables.User>;
  userProfile: import("indexdb-table").IndexDBTable<Tables.UserProfile>;
};
