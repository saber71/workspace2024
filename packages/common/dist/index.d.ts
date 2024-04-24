/// <reference types="../types.d.ts" />

export declare function composeUrl(...items: string[]): string;

declare type Condition = boolean | (() => boolean);

export declare function deepAssign<T extends object>(dst: any, src: T): T;

export declare function deepClone<T>(obj: T, options?: DeepCloneOption): T;

export declare function If<Result>(cond: Condition): If_2<Result>;

declare function If<Result>(cond: Condition): If_2<Result>;

declare interface If_2<Result = any> {
    then(value: Value<Result>): this;
    else(value: Value<Result>): Result;
    elseIf(cond: Condition): this;
    done(): Result;
}

export declare function isTypedArray(arr: any): arr is TypedArray;

export declare function remove<T>(collection: Array<T> | Set<T>, item?: T | ((item: T) => boolean), isPredicate?: boolean): T[] | Set<T>;

export declare function removeHeadTailChar(str: string, char: string): string;

declare type Value<Result = any> = Result | (() => Result);

export { }
