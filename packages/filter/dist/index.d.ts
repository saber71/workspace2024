export declare interface Condition<Value> {
    $less?: Value;
    $lessEqual?: Value;
    $greater?: Value;
    $greaterEqual?: Value;
    $equal?: Value;
    $not?: Value;
    $dateBefore?: Date | number;
    $dateAfter?: Date | number;
    $or?: Partial<Condition<Value>>[];
    $nor?: Partial<Condition<Value>>[];
    $in?: Value[];
    $notIn?: Value[];
    $contains: Value[] | Value;
    $notContains: Value[] | Value;
    $match: RegExp | string;
}

export declare type FilterCondition<TSchema extends {
    _id: string;
    [key: string]: any;
}> = Partial<{
    [P in keyof TSchema]: TSchema[P] | FilterCondition<TSchema[P]> | Partial<Condition<TSchema[P]>>;
}> & Partial<{
    $or: FilterCondition<TSchema>[];
    $nor: FilterCondition<TSchema>[];
}>;

export declare function matchFilterCondition<T extends {
    _id: string;
    [key: string]: any;
}>(data: T, condition: FilterCondition<T>): boolean;

export declare function parseFilterCondition(condition?: FilterCondition<any> | null): Array<(item: any) => boolean>;

export declare function sortData(array: any[], sortOrders: SortOrders): void;

export declare type SortOrders<T = any> = Array<{
    order: "asc" | "desc";
    field: keyof T;
}>;

export { }
