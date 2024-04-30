export declare type Class<T = any, P extends Array<any> = Array<any>> = {
    new (...args: P): T;
};

export declare function composeUrl(...items: string[]): string;

declare type Condition = boolean | (() => boolean);

export declare function deepAssign<T extends object>(dst: any, src: T): T;

export declare function deepClone<T>(obj: T, options?: DeepCloneOption): T;

export declare type DeepCloneOption = Partial<{
    cloneMapKey: boolean;
}>;

export declare type ExtractPromiseGenericType<T> = T extends Promise<infer U> ? U : T;

export declare function If<Result>(cond: Condition): If_2<Result>;

declare function If<Result>(cond: Condition): If_2<Result>;

declare interface If_2<Result = any> {
    then(value: Value<Result>): this;
    else(value: Value<Result>): Result;
    elseIf(cond: Condition): this;
    done(): Result;
}

export declare function isTypedArray(arr: any): arr is TypedArray;

export declare function randomArrayItem<T>(array: T[]): T;

export declare function randomInt(min: number, max: number): number;

export declare function randomNumber(min: number, max: number): number;

export declare function randomString(len: number): string;

export declare function remove<T>(collection: Array<T> | Set<T>, item?: T | ((item: T) => boolean), isPredicate?: boolean): T[] | Set<T>;

export declare function removeHeadTailChar(str: string, char: string): string;

export declare type TypedArray = Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array;

declare type Value<Result = any> = Result | (() => Result);

export { }
