import { Inject } from "dependency-injection";
import type { FilterCondition, SortOrders } from "filter";

export class ServerStore {
  private constructor(readonly adapter: StoreAdapter) {}

  static async create(adapter: StoreAdapter) {
    await adapter.init();
    return new ServerStore(adapter);
  }

  collection<T extends StoreItem>(name: string): StoreCollection<T> {
    return new StoreCollection<T>(this.adapter, name);
  }
}

export class StoreCollection<T extends StoreItem> {
  constructor(
    private readonly adapter: StoreAdapter,
    readonly name: string,
  ) {}

  private _isTransaction = false;
  private _isTransactionRollback = false;
  private _transactionRecords: TransactionRecord[] = [];

  transaction<Result>(cb: () => Result | Promise<Result>): Promise<Result> {
    return new Promise<Result>(async (resolve, reject) => {
      this._isTransaction = true;
      try {
        const result = await cb();
        resolve(result);
      } catch (e) {
        this._isTransactionRollback = true;
        for (let transactionRecord of this._transactionRecords.reverse()) {
          if (transactionRecord.type === "add") {
            await this.delete({ _id: transactionRecord.value._id } as any);
          } else if (transactionRecord.type === "delete") {
            await this.add(transactionRecord.value);
          } else if (transactionRecord.type === "update") {
            await this.update(transactionRecord.oldValue);
          }
        }
        this._transactionRecords.length = 0;
        this._isTransactionRollback = false;
        reject(e);
      }
      this._isTransaction = false;
    });
  }

  add(...items: PartialStoreItem<T>[]): Promise<string[]> {
    if (this._isTransaction && !this._isTransactionRollback)
      items.forEach((value) =>
        this._transactionRecords.push({ type: "add", value }),
      );
    return this.adapter.add(this.name, ...items);
  }

  async update(...items: (Partial<T> & { _id: string })[]): Promise<void> {
    if (this._isTransaction && !this._isTransactionRollback) {
      const promiseArray: Promise<void>[] = items.map(async (value) => {
        const oldValue = await this.getById(value._id);
        this._transactionRecords.push({ type: "update", oldValue });
      });
      await Promise.all(promiseArray);
    }
    return this.adapter.update(this.name, ...items);
  }

  search(
    condition?: FilterCondition<T>,
    sortOrders?: SortOrders<T>,
  ): Promise<T[]> {
    return this.adapter.search(this.name, condition, sortOrders);
  }

  paginationSearch(
    condition: FilterCondition<T> | undefined | null,
    curPage: number,
    pageSize: number,
    sortOrders?: SortOrders<T>,
  ): Promise<PaginationResult<T>> {
    return this.adapter.paginationSearch(
      this.name,
      condition,
      curPage,
      pageSize,
      sortOrders,
    );
  }

  async delete(condition?: FilterCondition<T>): Promise<T[]> {
    const deleted = await this.adapter.delete(this.name, condition);
    if (this._isTransaction && !this._isTransactionRollback) {
      deleted.forEach((value) =>
        this._transactionRecords.push({ type: "delete", value }),
      );
    }
    return deleted;
  }

  async searchOne(condition: FilterCondition<T>): Promise<T | undefined> {
    const result = await this.search(condition);
    return result[0];
  }

  getById(id: string): Promise<T | undefined> {
    return this.adapter.getById(this.name, id);
  }

  async getAll(): Promise<T[]> {
    return await this.search();
  }

  async save(data: PartialStoreItem<T>): Promise<T> {
    const exist = data._id ? await this.getById(data._id) : false;
    if (!exist) {
      const ids = await this.add(data);
      data._id = ids[0];
    } else {
      await this.update(Object.assign(exist, data));
    }
    return data as T;
  }

  async count(condition?: FilterCondition<T>) {
    const result = await this.search(condition);
    return result.length;
  }
}

/* 参数装饰器 */
export function Store(label: string = ServerStore.name) {
  return Inject({
    typeValueGetter: (container) => container.getValue(label),
  });
}

/* 参数装饰器 */
export function Collection(
  name: string,
  storeLabel: string = ServerStore.name,
) {
  return Inject({
    typeValueGetter: (container) =>
      container.getValue<ServerStore>(storeLabel).collection(name),
  });
}

export type TransactionRecord =
  | {
      type: "add" | "delete";
      value: any;
    }
  | { type: "update"; oldValue: any };

/* 保存数据的基础类型 */
export interface StoreItem {
  _id: string;
}

export type PartialStoreItem<T extends StoreItem> = Omit<T, "_id"> &
  Partial<{
    _id: string;
  }>;

/* 分页查询结果 */
export interface PaginationResult<T extends StoreItem> {
  data: T[];
  curPage: number;
  pageSize: number;
  total: number;
}

/* 存储器的适配器，由子类实现具体的存储逻辑，以及查询逻辑 */
export interface StoreAdapter {
  /* 新增数据 */
  add<T extends StoreItem = StoreItem>(
    collectionName: string,
    ...items: PartialStoreItem<T>[]
  ): Promise<string[]>;

  /* 更新数据 */
  update<T extends StoreItem = StoreItem>(
    collectionName: string,
    ...items: PartialStoreItem<T>[]
  ): Promise<void>;

  /* 查询数据。查询条件为空返回所有数据 */
  search<T extends StoreItem = StoreItem>(
    collectionName: string,
    condition?: FilterCondition<T> | null,
    sortOrders?: SortOrders<T>,
  ): Promise<T[]>;

  /* 分页查询。查询条件为空则查询所有数据 */
  paginationSearch<T extends StoreItem = StoreItem>(
    collectionName: string,
    condition: FilterCondition<T> | undefined | null,
    curPage: number,
    pageSize: number,
    sortOrders?: SortOrders<T>,
  ): Promise<PaginationResult<T>>;

  /* 删除数据，返回被删除数据的id。查询条件为空删除所有数据 */
  delete<T extends StoreItem = StoreItem>(
    collectionName: string,
    condition?: FilterCondition<T>,
  ): Promise<T[]>;

  getById<T extends StoreItem = StoreItem>(
    collectionName: string,
    id: string,
  ): Promise<T | undefined>;

  init(): Promise<void>;
}
