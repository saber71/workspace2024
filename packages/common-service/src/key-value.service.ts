import { IoC } from "ioc";
import { Service } from "vue-class";
import type { Table as DexieTable } from "dexie";
import type { IndexDBService } from "./indexDB.service";

/* 处理KeyValue表相关 */
@Service({ singleton: true, createOnLoad: true })
export class KeyValueService<
  KeyValueMap extends Record<string, any> = Record<string, any>,
> {
  constructor(
    @IoC.Inject<ServiceLabel>("IndexDBService")
    readonly indexedRepository: IndexDBService,
  ) {
    this.dexieTable = (indexedRepository as any).keyValue;
  }

  readonly dexieTable: DexieTable<Tables.KeyValue>;

  /* 根据key获取value，如果keu不存在则返回undefined */
  async getValue<Key extends keyof KeyValueMap>(
    key: Key,
  ): Promise<KeyValueMap[Key] | undefined> {
    return (await this.dexieTable.get(key as string))?.value;
  }

  /* 根据key获取value，如果keu不存在则报错 */
  async fetchValue<Key extends keyof KeyValueMap>(
    key: Key,
  ): Promise<KeyValueMap[Key]> {
    const result = await this.dexieTable.get(key as string);
    if (!result)
      throw new KeyValueNotFoundError(
        "Unable to find the value corresponding to the key " + (key as string),
      );
    return result.value;
  }

  /* 更新键值对，如果键值对是只读的则抛出错误 */
  async setValue<Key extends keyof KeyValueMap>(
    key: Key,
    value: KeyValueMap[Key],
    readonly: boolean = false,
  ) {
    let result = await this.dexieTable.get(key as string);
    if (result?.readonly)
      throw new KeyValueReadonlyError(
        `The value corresponding to Key ${key as string} is read-only`,
      );
    if (!result) result = { key: key as string, value, readonly };
    else {
      result.value = value;
      result.readonly = readonly;
    }
    await this.dexieTable.put(result, key as string);
  }
}

export class KeyValueReadonlyError extends Error {}

export class KeyValueNotFoundError extends Error {}
