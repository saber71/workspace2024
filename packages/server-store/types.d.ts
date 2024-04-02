///<reference types="dependency-injection/types.d.ts"/>
///<reference types="server/types.d.ts"/>
///<reference types="filter/types.d.ts"/>

declare type TransactionRecord =
  | {
      type: "add" | "delete";
      value: any;
    }
  | { type: "update"; oldValue: any };

/* 保存数据的基础类型 */
declare interface StoreItem {
  _id: string;

  [key: string | symbol]: any;
}

declare type PartialStoreItem<T extends StoreItem> = Omit<T, "_id"> &
  Partial<{
    _id: string;
  }>;

/* 分页查询结果 */
declare interface PaginationResult<T extends StoreItem> {
  data: T[];
  curPage: number;
  pageSize: number;
  total: number;
}

/* 存储器的适配器，由子类实现具体的存储逻辑，以及查询逻辑 */
declare interface StoreAdapter {
  /* 新增数据 */
  add<T extends StoreItem = StoreItem>(
    collectionName: string,
    ...items: PartialStoreItem<T>[]
  ): Promise<string[]>;

  /* 更新数据 */
  update<T extends StoreItem = StoreItem>(
    collectionName: string,
    ...items: Partial<T>[]
  ): Promise<void>;

  /* 查询数据。查询条件为空返回所有数据 */
  search<T extends StoreItem = StoreItem>(
    collectionName: string,
    condition?: FilterCondition<T>,
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

  getById(collectionName: string, id: string): Promise<T | undefined>;

  init(): Promise<void>;
}

declare type SortOrders<T extends StoreItem = any> = Array<{
  order: "asc" | "desc";
  field: keyof T;
}>;
