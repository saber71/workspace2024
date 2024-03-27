/// <reference types="../types.d.ts" />

export declare function Collection(name: string, storeLabel?: string): (clazz: any, propName: any, index?: any) => void;

export declare class ServerStore {
    readonly adapter: StoreAdapter;
    private constructor();
    static create(adapter: StoreAdapter): Promise<ServerStore>;
    collection<T extends StoreItem>(name: string): StoreCollection<T>;
}

export declare function Store(label?: string): (clazz: any, propName: any, index?: any) => void;

export declare class StoreCollection<T extends StoreItem> {
    private readonly adapter;
    readonly name: string;
    constructor(adapter: StoreAdapter, name: string);
    private _isTransaction;
    private _isTransactionRollback;
    private _transactionRecords;
    transaction<Result>(cb: () => Result | Promise<Result>): Promise<Result>;
    add(...items: PartialStoreItem<T>[]): Promise<string[]>;
    update(...items: (Partial<T> & {
        _id: string;
    })[]): Promise<void>;
    search(condition?: FilterCondition<T>, sortOrders?: SortOrders<T>): Promise<T[]>;
    paginationSearch(condition: FilterCondition<T> | undefined | null, curPage: number, pageSize: number, sortOrders?: SortOrders<T>): Promise<PaginationResult<T>>;
    delete(condition?: FilterCondition<T>): Promise<T[]>;
    searchOne(condition: FilterCondition<T>): Promise<T | undefined>;
    getById(id: string): Promise<T | undefined>;
    getAll(): Promise<T[]>;
    save(data: PartialStoreItem<T>): Promise<T>;
    count(condition?: FilterCondition<T>): Promise<number>;
}

export { }
