/// <reference types="../types.d.ts" />

export declare function Collection(name: string, storeLabel?: string): (clazz: any, propName: any, index?: any) => void;

export declare class ServerStore {
    readonly adapter: StoreAdapter;
    private constructor();
    private readonly _collectionMap;
    static create(adapter: StoreAdapter): Promise<ServerStore>;
    collection<T extends StoreItem>(name: string): StoreCollection<T>;
}

export declare function Store(label?: string): (clazz: any, propName: any, index?: any) => void;

export declare class StoreCollection<T extends StoreItem> {
    readonly adapter: StoreAdapter;
    readonly name: string;
    constructor(adapter: StoreAdapter, name: string);
    add(...items: PartialStoreItem<T>[]): Promise<string[]>;
    update(...items: T[]): Promise<void>;
    search(condition?: FilterCondition<T>, sortOrders?: SortOrders<T>): Promise<T[]>;
    paginationSearch(condition: FilterCondition<T> | undefined | null, curPage: number, pageSize: number, sortOrders?: SortOrders<T>): Promise<PaginationResult<T>>;
    delete(condition?: FilterCondition<T>): Promise<string[]>;
    getById(id: string): Promise<T | undefined>;
    getAll(): Promise<T[]>;
    save(data: PartialStoreItem<T>): Promise<T>;
}

export { }
