import { InjectService } from "@/services/index.ts";
import {
  type IndexDBService,
  type Tables,
} from "@/services/indexDB.service.ts";
import { Service } from "vue-class";
import type { Table as DexieTable } from "dexie";

export interface KeyValueMap {
  SystemInit: boolean;
  EnableGuest: boolean;
  AdminID: string;
  GuestID: string;
}

/* 处理KeyValue表相关 */
@Service({ singleton: true })
export class KeyValueService {
  constructor(
    @InjectService("IndexDBService")
    readonly indexedRepository: IndexDBService,
  ) {
    this.table = (indexedRepository as any).keyValue;
  }

  readonly table: DexieTable<Tables.KeyValue>;

  /* 根据key获取value，如果keu不存在则返回undefined */
  async getValue<Key extends keyof KeyValueMap>(
    key: Key,
  ): Promise<KeyValueMap[Key] | undefined> {
    return (await this.table.get(key))?.value;
  }

  /* 根据key获取value，如果keu不存在则报错 */
  async fetchValue<Key extends keyof KeyValueMap>(
    key: Key,
  ): Promise<KeyValueMap[Key]> {
    const result = await this.table.get(key);
    if (!result)
      throw new Error(
        "Unable to find the value corresponding to the key " + key,
      );
    return result.value;
  }

  /* 更新键值对，如果键值对是只读的则抛出错误 */
  async setValue<Key extends keyof KeyValueMap>(
    key: Key,
    value: KeyValueMap[Key],
    readonly: boolean = false,
  ) {
    let result = await this.table.get(key);
    if (result?.readonly)
      throw new Error(`The value corresponding to Key ${key} is read-only`);
    if (!result) result = { key, value, readonly };
    else {
      result.value = value;
      result.readonly = readonly;
    }
    await this.table.put(result, key);
  }
}
