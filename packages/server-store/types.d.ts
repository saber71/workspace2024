///<reference types="dependency-injection/types.d.ts"/>
///<reference types="server/types.d.ts"/>

/* 保存数据的基础类型 */
declare interface StoreItem {
  _id: string;
}

/* 分页查询结果 */
declare interface PaginationResult<T extends StoreItem> {
  data: T[];
  curPage: number;
  pageSize: number;
  total: number;
}

/* 存储器的适配器，由子类实现具体的存储逻辑，以及查询逻辑 */
declare interface StoreAdapter<T extends StoreItem = StoreItem> {
  /* 新增数据 */
  add(...items: T[]): string[];

  /* 更新数据 */
  update(...items: T[]): void;

  /* 查询数据。查询条件为空返回所有数据 */
  search(condition?: FilterCondition<T>): T[];

  /* 分页查询。查询条件为空则查询所有数据 */
  paginationSearch(
    condition: FilterCondition<T> | undefined | null,
    curPage: number,
    pageSize: number,
  ): PaginationResult<T>;

  /* 删除数据，返回被删除数据的id。查询条件为空删除所有数据 */
  delete(condition?: FilterCondition<T>): string[];
}

declare interface Condition<Value> {
  less?: Value;
  lessEqual?: Value;
  greater?: Value;
  greaterEqual?: Value;
  not?: Value;
  dateBefore?: Date | number;
  dateAfter?: Date | number;
  /* 数据满足任一条件即可 */
  or?: Condition<Value>[];
  /* or取反 */
  nor?: Condition<Value>[];
  /* 值是否在集合中 */
  in?: Value[];
  /* 值是否不在集合中 */
  notIn?: Value[];
  /* 适用于数组或字符串。数组或字符串是否包含指定的集合或字符串 */
  contains: Value[] | Value;
  /* 适用于数组或字符串。数组或字符串是否不包含指定的集合或字符串 */
  notContains: Value[] | Value;
}

declare type FilterCondition<TSchema extends StoreItem> =
  | {
      [P in keyof TSchema]?: TSchema[P] | Condition<TSchema[P]>;
    }
  | {
      or?: FilterCondition<TSchema>;
      nor?: FilterCondition<TSchema>;
    };
