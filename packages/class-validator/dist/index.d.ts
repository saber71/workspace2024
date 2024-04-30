import { AlphaLocale } from 'validator';
import { AlphanumericLocale } from 'validator';
import { Class } from 'dependency-injection';
import { HashAlgorithm } from 'validator';
import { IdentityCardLocale } from 'validator';
import { IPVersion } from 'validator';
import { ISBNVersion } from 'validator';
import { IsByteLengthOptions } from 'validator';
import { IsCreditCardOptions } from 'validator';
import { IsCurrencyOptions } from 'validator';
import { IsEmailOptions } from 'validator';
import { IsEmptyOptions } from 'validator';
import { IsIMEIOptions } from 'validator';
import { IsISO8601Options } from 'validator';
import { IsISSNOptions } from 'validator';
import { IsLengthOptions } from 'validator';
import { IsMACAddressOptions } from 'validator';
import { IsTimeOptions } from 'validator';
import { IsURLOptions } from 'validator';
import { MobilePhoneLocale } from 'validator';
import { PostalCodeLocale } from 'validator';
import { StrongPasswordOptions } from 'validator';
import { UUIDVersion } from 'validator';

export declare interface ArrayValidatorArgMap {
    isArray: void;
    isArrayStrict: void;
    arrayContains: any[];
    arrayMaxSize: number;
    arrayMinSize: number;
    arrayNotContains: any[];
    arrayNotEmpty: void;
    arrayUnique: void;
}

export declare interface CommonValidatorArgMap {
    hasKeys: (string | symbol)[];
    notHasKeys: (string | symbol)[];
    equals: any;
    notEquals: any;
    isInArray: any[];
    isNotInArray: any[];
}

export declare interface DateValidatorArgMap {
    maxDate: Date | number;
    minDate: Date | number;
}

export declare class NoValidationError extends Error {
}

export declare interface NumberValidatorArgMap {
    isDivisibleBy: number;
    isNegative: void;
    isPositive: void;
    max: number;
    min: number;
}

export declare interface ObjectValidatorArgMap {
    isInstanceOf: Class[];
    isNotEmptyObject: void;
}

export declare interface StringValidatorArgMap {
    isMatch: RegExp;
    isAlphanumeric: AlphanumericLocale;
    isAlpha: AlphaLocale;
    isAscii: void;
    isBase32: void;
    isBase58: void;
    isBase64: void;
    isBIC: void;
    isBtcAddress: void;
    isByteLength: IsByteLengthOptions;
    isCreditCard: IsCreditCardOptions;
    isCurrency: IsCurrencyOptions;
    isDataURI: void;
    isEthereumAddress: void;
    isEAN: void;
    isEmail: void;
    isEmpty: IsEmptyOptions;
    isFQDN: void;
    isFreightContainerID: void;
    isFullWidth: void;
    isHalfWidth: void;
    isIBAN: void;
    isHash: HashAlgorithm;
    isHexadecimal: void;
    isHexColor: void;
    isHSL: void;
    isIdentityCard: IdentityCardLocale;
    isIMEI: IsIMEIOptions;
    isIP: IPVersion;
    isIPRange: IPVersion;
    isISBN: ISBNVersion;
    isISIN: void;
    isISO6346: void;
    isISO6391: void;
    isISO8601: IsISO8601Options;
    isISO31661Alpha2: void;
    isISO31661Alpha3: void;
    isISO4217: void;
    isISRC: void;
    isISSN: IsISSNOptions;
    isJSON: void;
    isJWT: void;
    isLength: IsLengthOptions;
    isLocale: void;
    isLowercase: void;
    isMACAddress: IsMACAddressOptions;
    isMagnetURI: void;
    isMailtoURI: IsEmailOptions;
    isMD5: void;
    isMimeType: void;
    isMobilePhone: MobilePhoneLocale;
    isMongoId: void;
    isMultibyte: void;
    isOctal: void;
    isPassportNumber: string;
    isPort: void;
    isPostalCode: PostalCodeLocale;
    isRFC3339: void;
    isRgbColor: void;
    isSemVer: void;
    isSurrogatePair: void;
    isUppercase: void;
    isSlug: void;
    isStrongPassword: StrongPasswordOptions;
    isTime: IsTimeOptions;
    isURL: IsURLOptions;
    isUUID: UUIDVersion;
    isVariableWidth: void;
}

export declare interface TypeValidationArgMap {
    isNumber: void;
    isString: void;
    isBoolean: void;
    isFunction: void;
    isSymbol: void;
    isObject: void;
    isDate: void;
    isNull: void;
    isUndefined: void;
    isTruthy: void;
    isFalsy: void;
}

/**
 * 校验实例中的属性是否合乎元数据中的校验规则。返回的是无法通过校验的属性数组
 * @throws NoValidationError 当实例在元数据中没有校验数据存在时抛出错误
 */
export declare function validate(instance: any): string[];

export declare function Validation<Key extends keyof ValidationArgMap>(option: ValidationOption<Key>): (target: any, propName?: any) => void;

export declare interface ValidationArgMap extends TypeValidationArgMap, ArrayValidatorArgMap, CommonValidatorArgMap, DateValidatorArgMap, NumberValidatorArgMap, ObjectValidatorArgMap, StringValidatorArgMap {
}

export declare interface ValidationOption<Key extends keyof ValidationArgMap> {
    validatorType: Key;
    arg?: ValidationArgMap[Key];
    recursive?: boolean;
    allowUndefined?: boolean;
    onlyPassOne?: boolean;
}

export declare interface Validators {
    onlyPassOne: boolean;
    validators: Array<{
        fn: Function;
        arg?: any;
        recursive: boolean;
        type?: Class;
        allowUndefined?: boolean;
        clazz: Class;
        onlyPassOnly?: boolean;
    }>;
}

export { }
