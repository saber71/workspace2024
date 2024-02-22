import type { Table } from 'dexie';

export declare class IndexDBTable<T extends {
    id: string;
}> {
    readonly table: Table<KeyValue<T>, string>;
    private _data?;
    constructor(table: Table<KeyValue<T>, string>);
    getAll(): Promise<T[]>;
    add(item: T): Promise<string>;
    bulkAdd(...items: T[]): Promise<string>;
    delete(id: string): Promise<void>;
    bulkDelete(...ids: string[]): Promise<void>;
    put(item: T): Promise<string>;
    bulkPut(...items: T[]): Promise<string>;
    getById(id: string): Promise<T | undefined>;
    search(predicate: (item: T) => boolean): Promise<T[]>;
    searchOne(predicate: (item: T) => boolean): Promise<T | undefined>;
    private _clearCache;
}

declare interface KeyValue<T> {
    key: string;
    value: T;
}

export { }
