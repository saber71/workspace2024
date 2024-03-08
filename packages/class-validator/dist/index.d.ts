/// <reference types="../types.d.ts" />

export declare class NoValidationError extends Error {
}

/**
 * 校验实例中的属性是否合乎元数据中的校验规则。返回的是无法通过校验的属性数组
 * @throws NoValidationError 当实例在元数据中没有校验数据存在时抛出错误
 */
export declare function validate(instance: any): string[];

export declare function Validation<Key extends keyof ValidationArgMap>(option: ValidationOption<Key>): (target: any, propName?: any) => void;

export { }
