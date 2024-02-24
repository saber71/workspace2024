import Dexie from "dexie";
import { IndexDBTable } from "indexdb-table";
import { IoC } from "ioc";
import { Service } from "vue-class";

/* 使用Dexie处理IndexDB相关 */
@Service({ singleton: true, createOnLoad: true })
export class IndexDBService extends Dexie {
  constructor(
    @IoC.Inject<ServiceLabel>("DatabaseName")
    readonly databaseName: string,
    @IoC.Inject<ServiceLabel>("TableNames")
    readonly tableNames: Array<keyof IndexdbTableMap>,
  ) {
    super(databaseName);

    const schema: Record<string, string> = {
      keyValue: "&key,value,readonly",
      user: "&key,value",
      userProfile: "&key,value",
    };
    for (let tableName of tableNames) {
      schema[tableName] = "&key,value";
    }

    this.version(1).stores(schema);

    for (let tableName of ["user", "userProfile", "keyValue", ...tableNames]) {
      (this._indexdbTableMap as any)[tableName] = new IndexDBTable<any>(
        this._allTables[tableName] as any,
      );
    }
  }

  private readonly _indexdbTableMap: IndexdbTableMap = {} as any;

  /* 获取对应名字的IndexdbTable对象 */
  getTable<Key extends keyof IndexdbTableMap>(key: Key): IndexdbTableMap[Key] {
    return this._indexdbTableMap[key];
  }
}
