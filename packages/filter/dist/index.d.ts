/// <reference types="../types.d.ts" />

export declare function matchFilterCondition<T>(data: T, condition: FilterCondition<T>): boolean;

export declare function parseFilterCondition(condition?: FilterCondition<any> | null): Array<(item: any) => boolean>;

export declare function sortData(array: any[], sortOrders: SortOrders): void;

export { }
