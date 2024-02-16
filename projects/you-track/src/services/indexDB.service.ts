import { Table } from "@/services/index.ts";
import Dexie from "dexie";
import { Service } from "vue-class";

/* 使用Dexie处理IndexDB相关 */
@Service({ singleton: true, createOnLoad: true })
export class IndexDBService extends Dexie {
  constructor() {
    super("YouTrack");

    this.version(1).stores({
      keyValue: "&key,value,readonly",
      dataset: "&key,value",
    });

    this.user = new Table<Tables.User>(this, "user", () => ({
      id: "",
      password: "",
      name: "",
      loginName: "",
      email: "",
      createTime: new Date(),
    }));
  }

  readonly user: Table<Tables.User>;
}

export namespace Tables {
  export interface KeyValue {
    key: string;
    value: any;
    readonly: boolean;
  }

  export interface Dataset<Value = any> {
    key: string;
    value: Record<string, Value>;
  }

  export interface User {
    readonly id: string;
    name: string;
    loginName: string;
    email: string;
    password: string;
    avatar?: string;
    createTime: Date;
  }
}
