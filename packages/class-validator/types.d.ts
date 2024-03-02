/// <reference types="dependency-injection/types" />

declare interface TypeValidationOptionMap {
  isNumber: void;
  isNumberStrict: void;
  isString: void;
  isStringStrict: void;
  isBoolean: void;
  isBooleanStrict: void;
  isFunction: void;
  isFunctionStrict: void;
  isSymbol: void;
  isSymbolStrict: void;
  isObject: void;
  isObjectStrict: void;
  isDate: void;
  isDateStrict: void;
  isNull: void;
  isUndefined: void;
  isTruthy: void;
  isFalsy: void;
}

declare interface ArrayValidatorOptionMap {
  isArray: void;
  isArrayStrict: void;
  arrayContains: any[];
  arrayMaxSize: number;
  arrayMinSize: number;
  arrayNotContains: any[];
  arrayNotEmpty: void;
  arrayUnique: void;
}

declare interface CommonValidatorOptionMap {
  hasKeys: (string | symbol)[];
  notHasKeys: (string | symbol)[];
  equals: any;
  notEquals: any;
  isInArray: any[];
  isNotInArray: any[];
}

declare interface DateValidatorOptionMap {
  maxDate: Date | number;
  minDate: Date | number;
}

declare interface NumberValidatorOptionMap {
  isDivisibleBy: number;
  isNegative: void;
  isPositive: void;
  max: number;
  min: number;
}

declare interface ObjectValidatorOptionMap {
  isInstanceOf: Class[];
  isNotEmptyObject: void;
}

declare interface StringValidatorOptionMap {
  isMatch: RegExp;
  isAlphanumeric: import("validator").AlphanumericLocale;
  isAlpha: import("validator").AlphaLocale;
  isAscii: void;
  isBase32: void;
  isBase58: void;
  isBase64: void;
  isBIC: void;
  isBtcAddress: void;
  isByteLength: import("validator").IsByteLengthOptions;
  isCreditCard: import("validator").IsCreditCardOptions;
  isCurrency: import("validator").IsCurrencyOptions;
  isDataURI: void;
  isEthereumAddress: void;
  isEAN: void;
  isEmail: void;
  isEmpty: import("validator").IsEmptyOptions;
  isFQDN: void;
  isFreightContainerID: void;
  isFullWidth: void;
  isHalfWidth: void;
  isIBAN: void;
  isHash: import("validator").HashAlgorithm;
  isHexadecimal: void;
  isHexColor: void;
  isHSL: void;
  isIdentityCard: import("validator").IdentityCardLocale;
  isIMEI: import("validator").IsIMEIOptions;
  isIP: import("validator").IPVersion;
  isIPRange: import("validator").IPVersion;
  isISBN: import("validator").ISBNVersion;
  isISIN: void;
  isISO6346: void;
  isISO6391: void;
  isISO8601: import("validator").IsISO8601Options;
  isISO31661Alpha2: void;
  isISO31661Alpha3: void;
  isISO4217: void;
  isISRC: void;
  isISSN: import("validator").IsISSNOptions;
  isJSON: void;
  isJWT: void;
  isLength: import("validator").IsLengthOptions;
  isLocale: void;
  isLowercase: void;
  isMACAddress: import("validator").IsMACAddressOptions;
  isMagnetURI: void;
  isMailtoURI: import("validator").IsEmailOptions;
  isMD5: void;
  isMimeType: void;
  isMobilePhone: import("validator").MobilePhoneLocale;
  isMongoId: void;
  isMultibyte: void;
  isOctal: void;
  isPassportNumber: string;
  isPort: void;
  isPostalCode: import("validator").PostalCodeLocale;
  isRFC3339: void;
  isRgbColor: void;
  isSemVer: void;
  isSurrogatePair: void;
  isUppercase: void;
  isSlug: void;
  isStrongPassword: import("validator").StrongPasswordOptions;
  isTime: import("validator").IsTimeOptions;
  isURL: import("validator").IsURLOptions;
  isUUID: import("validator").UUIDVersion;
  isVariableWidth: void;
}

declare interface ValidationOptionMap
  extends TypeValidationOptionMap,
    ArrayValidatorOptionMap,
    CommonValidatorOptionMap,
    DateValidatorOptionMap,
    NumberValidatorOptionMap,
    ObjectValidatorOptionMap,
    StringValidatorOptionMap {}

declare interface Validators {
  onlyPassOne: boolean;
  validators: Array<{ fn: Function; arg?: any }>;
}
