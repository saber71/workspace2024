import { FilterCondition } from 'filter';
import { SortOrders } from 'filter';

export declare function Collection(name: string, storeLabel?: string): (clazz: any, propName: any, index?: any) => void;

export declare interface PaginationResult<T extends StoreItem> {
    data: T[];
    curPage: number;
    pageSize: number;
    total: number;
}

export declare type PartialStoreItem<T extends StoreItem> = Omit<T, "_id"> & Partial<{
    _id: string;
}>;

export declare class ServerStore {
    readonly adapter: StoreAdapter;
    private constructor();
    static create(adapter: StoreAdapter): Promise<ServerStore>;
    collection<T extends StoreItem>(name: string): StoreCollection<T>;
}

export declare function Store(label?: string): (clazz: any, propName: any, index?: any) => void;

export declare interface StoreAdapter {
    add<T extends StoreItem = StoreItem>(collectionName: string, ...items: PartialStoreItem<T>[]): Promise<string[]>;
    update<T extends StoreItem = StoreItem>(collectionName: string, ...items: PartialStoreItem<T>[]): Promise<void>;
    search<T extends StoreItem = StoreItem>(collectionName: string, condition?: FilterCondition<T> | null, sortOrders?: SortOrders<T>): Promise<T[]>;
    paginationSearch<T extends StoreItem = StoreItem>(collectionName: string, condition: FilterCondition<T> | undefined | null, curPage: number, pageSize: number, sortOrders?: SortOrders<T>): Promise<PaginationResult<T>>;
    delete<T extends StoreItem = StoreItem>(collectionName: string, condition?: FilterCondition<T>): Promise<T[]>;
    getById<T extends StoreItem = StoreItem>(collectionName: string, id: string): Promise<T | undefined>;
    init(): Promise<void>;
}

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

export declare interface StoreItem {
    _id: string;
}

export declare type TransactionRecord = {
    type: "add" | "delete";
    value: any;
} | {
    type: "update";
    oldValue: any;
};

export { }
