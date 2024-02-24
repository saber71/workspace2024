import { IoC } from "ioc";
import { ModuleName } from "vue-class";
import type { UseUserStore } from "./user.service";

export * from "./common.service";
export * from "./indexDB.service";
export * from "./key-value.service";
export * from "./user.service";

export namespace CommonService {
  export function setup(option: {
    databaseName: string;
    tableNames: Array<keyof IndexdbTableMap>;
    userStore: UseUserStore;
  }) {
    const container = IoC.getContainer(ModuleName);
    container
      .bind("DatabaseName" satisfies ServiceLabel)
      .toConstantValue(option.databaseName);
    container
      .bind("TableNames" satisfies ServiceLabel)
      .toConstantValue(option.tableNames);
    container
      .bind("UseUserStore" satisfies ServiceLabel)
      .toConstantValue(option.userStore);
  }
}
