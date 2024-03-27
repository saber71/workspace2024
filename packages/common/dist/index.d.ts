/// <reference types="../types.d.ts" />

export declare function composeUrl(...items: string[]): string;

export declare function deepAssign<T extends object>(dst: any, src: T): T;

export declare function deepClone<T>(obj: T, options?: DeepCloneOption): T;

export declare function isTypedArray(arr: any): arr is TypedArray;

export declare function remove<T>(collection: Array<T> | Set<T>, item?: T | ((item: T) => boolean), isPredicate?: boolean): T[] | Set<T>;

export declare function removeHeadTailChar(str: string, char: string): string;

export { }
