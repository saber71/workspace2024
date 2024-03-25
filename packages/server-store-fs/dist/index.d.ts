/// <reference types="server-store/types.d.ts" />

export declare function createServerStoreFS(basePath?: string): StoreAdapter;

export declare function matchFilterCondition<T extends StoreItem>(data: T, condition: FilterCondition<T>): boolean;

export { }
