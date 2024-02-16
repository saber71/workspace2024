import {
  type IndexDBService,
  type Tables,
} from "@/services/indexDB.service.ts";
import { IoC } from "ioc";
import type { Table as DexieTable } from "dexie";
import { v4 } from "uuid";

export type Services =
  | "CommonService"
  | "IndexDBService"
  | "UserService"
  | "KeyValueService";

export function InjectService<Label extends Services>(label: Label) {
  return IoC.Inject(label);
}

export class Table<T extends { id: string }> {
  constructor(
    readonly indexDBService: IndexDBService,
    readonly key: string,
    readonly initializer: () => T,
  ) {
    this._datasetTable = (indexDBService as any).dataset;
  }

  private readonly _datasetTable: DexieTable<Tables.Dataset<T>>;

  /* 缓存的数据集对象 */
  private _dataset?: Tables.Dataset<T>;

  /* 获取数据集对象并缓存下来，如果不存在则新建 */
  async getDataset(): Promise<Tables.Dataset<T>> {
    if (!this._dataset)
      this._dataset = (await this._datasetTable.get(this.key)) ?? {
        key: this.key,
        value: {},
      };
    return this._dataset;
  }

  /* 获取所有数据 */
  async getAll(): Promise<T[]> {
    return Object.values((await this.getDataset()).value).map((item) =>
      Object.assign({}, this.initializer(), item),
    );
  }

  /* 根据id获取数据 */
  async getById(id: string): Promise<T | undefined> {
    const dataset = await this.getDataset();
    return dataset.value[id];
  }

  /* 保存数据，并清空缓存 */
  async save() {
    if (this._dataset) {
      this._datasetTable.put(this._dataset, this.key);
      this._dataset = undefined;
    }
  }

  /* 新增数据并保存 */
  async add(
    data: Omit<T, "id"> & { id?: string },
    saveImmediate: boolean = true,
  ) {
    if (!data.id) data.id = v4();
    const dataset = await this.getDataset();
    if (dataset.value[data.id])
      throw new Error("The ID of the data is duplicated");
    dataset.value[data.id] = data as T;
    if (saveImmediate) await this.save();
  }

  /* 批量新增数据并保存 */
  async batchAdd(dataArray: Array<Omit<T, "id"> & { id?: string }>) {
    await Promise.all(dataArray.map((data) => this.add(data, false)));
    await this.save();
  }

  /* 过滤数据 */
  async searchAll(predicate: (item: T) => boolean): Promise<T[]> {
    return (await this.getAll()).filter(predicate);
  }

  /* 过滤数据并返回其中的一个 */
  async searchOne(
    predicate: (item: T) => boolean,
    index: number = 0,
  ): Promise<T | undefined> {
    const arr = await this.searchAll(predicate);
    return arr.at(index);
  }

  /* 分页搜索数据 */
  async searchPage(
    predicate: (item: T) => boolean,
    curPage: number,
    pageSize: number,
  ) {
    const arr = await this.searchAll(predicate);
    if (curPage <= 0) curPage = 1;
    return {
      curPage,
      pageSize,
      totalCount: arr.length,
      data: arr.slice((curPage - 1) * pageSize, curPage * pageSize),
    } satisfies SearchPageResult<T>;
  }

  /* 删除指定的数据并保存 */
  async delete(item: T | string, saveImmediate: boolean = true) {
    const dataset = await this.getDataset();
    delete dataset.value[typeof item === "object" ? item.id : item];
    if (saveImmediate) await this.save();
  }

  /* 批量删除指定的数据并保存 */
  async batchDelete(items: Array<string | T>) {
    await Promise.all(items.map((item) => this.delete(item)));
    await this.save();
  }

  /* 删除所有满足条件的数据并保存 */
  async deleteAll(predicate?: (item: T) => boolean) {
    const dataset = await this.getDataset();
    if (!predicate) dataset.value = {};
    else await this.batchDelete(await this.searchAll(predicate));
    await this.save();
  }
}

/* 分页搜索的结果 */
export interface SearchPageResult<T = any> {
  curPage: number;
  pageSize: number;
  data: T[];
  totalCount: number;
}
