/// <reference types="../types.d.ts" />

import "reflect-metadata";
import { getDecoratedName, Metadata } from "dependency-injection";
import validator from "validator";

const keyPrefix = "__class-validator__";

/* 标识字段需要进行校验，同时指定校验规则 */
export function Validation<Key extends keyof ValidationArgMap>(
  option: ValidationOption<Key>,
) {
  return (target: any, propName?: any) => {
    propName = getDecoratedName(propName);
    const type = Reflect.getMetadata("design:type", target, propName);
    const metadata = Metadata.getOrCreateMetadata(target);
    const validations = getValidations(metadata.userData, propName);
    validations.validators.push({
      fn: validatorMap[option.validatorType],
      arg: option.arg,
      recursive: option.recursive ?? true,
      type,
    });
  };
}

/**
 * 校验实例中的属性是否合乎元数据中的校验规则。返回的是无法通过校验的属性数组
 * @throws NoValidationError 当实例在元数据中没有校验数据存在时抛出错误
 */
export function validate(instance: any) {
  const errorPropNames: string[] = [];
  const userData = Metadata.getOrCreateMetadata(instance).userData;
  let count = 0;
  for (let key in userData) {
    if (key.includes(keyPrefix)) {
      count++;
      const propName = key.replace(keyPrefix, "");
      const validations = getValidations(userData, propName);
      const value = instance[propName];
      let result = false;
      for (let i = 0; i < validations.validators.length; i++) {
        const validator = validations.validators[i];
        result = validator.fn(value, validator.arg);
        if (
          result &&
          validator.type &&
          validator.recursive &&
          typeEnableRecursive(validator.type)
        ) {
          value.constructor = validator.type;
          try {
            const errorNames = validate(value);
            result = errorNames.length === 0;
          } catch (e) {
            if (e instanceof NoValidationError) result = false;
            else throw e;
          }
        }
        if (validations.onlyPassOne) {
          if (result) break;
        } else if (!result) break;
      }
      if (!result) errorPropNames.push(propName);
    }
  }
  if (count === 0)
    throw new NoValidationError(
      `找不到实例${instance.constructor.name}对应的校验数据`,
    );
  return errorPropNames;
}

/* 当实例在元数据中没有校验数据存在时抛出错误 */
export class NoValidationError extends Error {}

/* 检查给定类是否能够进行递归校验 */
function typeEnableRecursive(type: Class) {
  return ![
    "Object",
    "Function",
    "Number",
    "String",
    "Boolean",
    "Symbol",
    "Array",
    "Date",
    "Set",
    "Map",
  ].includes(type.name);
}

function getValidations(userData: any, propName: string): Validators {
  const key = keyPrefix + propName;
  let result: Validators = userData[key];
  if (!result)
    userData[key] = result = {
      onlyPassOne: false,
      validators: [],
    };
  return result;
}

const typeValidationMap: Record<
  keyof TypeValidationArgMap,
  (...arg: any[]) => boolean
> = {
  isBoolean: (value: any) => typeof value === "boolean" || value === undefined,
  isBooleanStrict: (value: any) => typeof value === "boolean",
  isNumber: (value: any) => typeof value === "number" || value === undefined,
  isNumberStrict: (value: any) => typeof value === "number",
  isString: (value: any) => typeof value === "string" || value === undefined,
  isStringStrict: (value: any) => typeof value === "string",
  isFalsy: (value: any) => !value,
  isTruthy: (value: any) => !!value,
  isSymbol: (value: any) => typeof value === "symbol" || value === undefined,
  isSymbolStrict: (value: any) => typeof value === "symbol",
  isFunction: (value: any) =>
    typeof value === "function" || value === undefined,
  isFunctionStrict: (value: any) => typeof value === "function",
  isNull: (value: any) => value === null,
  isUndefined: (value: any) => value === undefined,
  isObject: (value: any) => typeof value === "object" || value === undefined,
  isObjectStrict: (value: any) => typeof value === "object",
  isDate: (value) => value instanceof Date || value === undefined,
  isDateStrict: (value) => value instanceof Date,
};

const arrayValidations: Record<
  keyof ArrayValidatorArgMap,
  (...arg: any[]) => boolean
> = {
  isArray: (value) => value instanceof Array || value === undefined,
  isArrayStrict: (value) => value instanceof Array,
  arrayContains: (value, options = []) =>
    arrayValidations.isArrayStrict(value) &&
    options.reduce(
      (previousValue: boolean, currentValue: any) =>
        previousValue && value.includes(currentValue),
      true,
    ),
  arrayNotContains: (value, options = []) =>
    arrayValidations.isArrayStrict(value) &&
    options.reduce(
      (previousValue: boolean, currentValue: any) =>
        previousValue && !value.includes(currentValue),
      true,
    ),
  arrayMaxSize: (value, size = 0) =>
    arrayValidations.isArrayStrict(value) && value.length <= size,
  arrayMinSize: (value, size = 0) =>
    arrayValidations.isArrayStrict(value) && value.length >= size,
  arrayNotEmpty: (value) =>
    arrayValidations.isArrayStrict(value) && value.length > 0,
  arrayUnique: (value) =>
    arrayValidations.isArrayStrict(value) &&
    new Set(value).size === value.length,
};

const commonValidations: Record<
  keyof CommonValidatorArgMap,
  (...args: any[]) => boolean
> = {
  hasKeys: (value, keys = []) =>
    keys.reduce(
      (previousValue: boolean, key: string) => previousValue && key in value,
      true,
    ),
  notHasKeys: (value, keys = []) =>
    keys.reduce(
      (previousValue: boolean, key: string) => previousValue && !(key in value),
      true,
    ),
  equals: (arg1, arg2) => arg1 === arg2,
  notEquals: (arg1, arg2) => arg1 !== arg2,
  isInArray: (arg1, arg2 = []) => arg2.includes(arg1),
  isNotInArray: (arg1, arg2 = []) => !arg2.includes(arg1),
};

function getTime(date: Date | number) {
  return date instanceof Date ? date.getTime() : date;
}

const dateValidations: Record<
  keyof DateValidatorArgMap,
  (...args: any[]) => boolean
> = {
  maxDate: (arg1, arg2 = new Date()) =>
    typeValidationMap.isDateStrict(arg1) && arg1.getTime() <= getTime(arg2),
  minDate: (arg1, arg2 = new Date()) =>
    typeValidationMap.isDateStrict(arg1) && arg1.getTime() >= getTime(arg2),
};

const numberValidations: Record<
  keyof NumberValidatorArgMap,
  (...args: any[]) => boolean
> = {
  isDivisibleBy: (arg1, arg2) => validator.isDivisibleBy(arg1 + "", arg2),
  isNegative: (arg) => arg < 0,
  isPositive: (arg) => arg > 0,
  max: (arg1, arg2) => arg1 <= arg2,
  min: (arg1, arg2) => arg1 >= arg2,
};

const objectValidationMap: Record<
  keyof ObjectValidatorArgMap,
  (...args: any[]) => boolean
> = {
  isInstanceOf: (arg1, arg2) => arg1 instanceof arg2,
  isNotEmptyObject: (arg) => Object.keys(arg).length > 0,
};

const stringValidationMap: Record<
  keyof StringValidatorArgMap,
  (...args: any[]) => boolean
> = {
  isMatch: validator.matches,
  isAlpha: validator.isAlpha,
  isAlphanumeric: validator.isAlphanumeric,
  isAscii: validator.isAscii,
  isBase32: validator.isBase32,
  isBase58: validator.isBase58,
  isBase64: validator.isBase64,
  isBIC: validator.isBIC,
  isBtcAddress: validator.isBtcAddress,
  isByteLength: validator.isByteLength,
  isCreditCard: validator.isCreditCard,
  isCurrency: validator.isCurrency,
  isDataURI: validator.isDataURI,
  isEthereumAddress: validator.isEthereumAddress,
  isEAN: validator.isEAN,
  isEmail: validator.isEmail,
  isEmpty: validator.isEmpty,
  isFQDN: validator.isFQDN,
  isFreightContainerID: validator.isFreightContainerID,
  isFullWidth: validator.isFullWidth,
  isHalfWidth: validator.isHalfWidth,
  isIBAN: validator.isIBAN,
  isHash: validator.isHash,
  isHexadecimal: validator.isHexadecimal,
  isHexColor: validator.isHexColor,
  isHSL: validator.isHSL,
  isIMEI: validator.isIMEI,
  isIdentityCard: validator.isIdentityCard,
  isIP: validator.isIP,
  isIPRange: validator.isIPRange,
  isISBN: validator.isISBN,
  isISIN: validator.isISIN,
  isISO4217: validator.isISO4217,
  isISO6346: validator.isISO6346,
  isISO6391: validator.isISO6391,
  isISO8601: validator.isISO8601,
  isISO31661Alpha2: validator.isISO31661Alpha2,
  isISO31661Alpha3: validator.isISO31661Alpha3,
  isISRC: validator.isISRC,
  isISSN: validator.isISSN,
  isJSON: validator.isJSON,
  isJWT: validator.isJWT,
  isLength: validator.isLength,
  isLocale: validator.isLocale,
  isLowercase: validator.isLowercase,
  isMACAddress: validator.isMACAddress,
  isMagnetURI: validator.isMagnetURI,
  isMailtoURI: validator.isMailtoURI,
  isMD5: validator.isMD5,
  isMimeType: validator.isMimeType,
  isMobilePhone: validator.isMobilePhone,
  isMongoId: validator.isMongoId,
  isMultibyte: validator.isMultibyte,
  isOctal: validator.isOctal,
  isPort: (arg) => validator.isPort(arg + ""),
  isPassportNumber: validator.isPassportNumber,
  isPostalCode: validator.isPostalCode,
  isRFC3339: validator.isRFC3339,
  isRgbColor: validator.isRgbColor,
  isSemVer: validator.isSemVer,
  isSlug: validator.isSlug,
  isTime: validator.isTime,
  isUUID: validator.isUUID,
  isStrongPassword: validator.isStrongPassword,
  isURL: validator.isURL,
  isSurrogatePair: validator.isSurrogatePair,
  isUppercase: validator.isUppercase,
  isVariableWidth: validator.isVariableWidth,
};

const validatorMap: Record<keyof ValidationArgMap, any> = {
  ...typeValidationMap,
  ...commonValidations,
  ...dateValidations,
  ...numberValidations,
  ...objectValidationMap,
  ...stringValidationMap,
  ...arrayValidations,
};
