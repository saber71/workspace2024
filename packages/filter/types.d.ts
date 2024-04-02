declare interface Condition<Value> {
  $less?: Value;
  $lessEqual?: Value;
  $greater?: Value;
  $greaterEqual?: Value;
  $equal?: Value;
  $not?: Value;
  $dateBefore?: Date | number;
  $dateAfter?: Date | number;
  /* 数据满足任一条件即可 */
  $or?: Partial<Condition<Value>>[];
  /* or取反, 条件都不满足时即可 */
  $nor?: Partial<Condition<Value>>[];
  /* 值是否在集合中 */
  $in?: Value[];
  /* 值是否不在集合中 */
  $notIn?: Value[];
  /* 适用于数组或字符串。数组或字符串是否包含指定的集合或字符串 */
  $contains: Value[] | Value;
  /* 适用于数组或字符串。数组或字符串是否不包含指定的集合或字符串 */
  $notContains: Value[] | Value;
  $match: RegExp | string;
}

declare type FilterCondition<TSchema extends StoreItem> = Partial<{
  [P in keyof TSchema]:
    | TSchema[P]
    | FilterCondition<TSchema[P]>
    | Partial<Condition<TSchema[P]>>;
}> &
  Partial<{
    $or: FilterCondition<TSchema>[];
    $nor: FilterCondition<TSchema>[];
  }>;

declare type SortOrders<T = any> = Array<{
  order: "asc" | "desc";
  field: keyof T;
}>;
