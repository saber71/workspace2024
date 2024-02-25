export declare function getDecoratedName(ctx?: string | ClassMemberDecoratorContext): string | symbol;

/**
 * 构造函数参数装饰器、字段装饰器
 * @param typeLabel 指定这个字段/参数的类型
 * @throws InjectNotFoundTypeError 在无法确定被装饰者的类型时抛出
 */
export declare function Inject(typeLabel?: string): (clazz: any, propName: ClassFieldDecoratorContext | any, index?: number) => void;

/**
 * 类装饰器
 * @param paramtypes 指定部分或全部构造函数入参的类型，就好像是使用装饰器Inject去装饰参数。装饰器Inject优先级更高。key为入参的序号，value为入参类型
 */
export declare function Injectable(paramtypes?: Record<number, string>): (clazz: Class, ctx?: any) => void;

export declare class InjectNotFoundTypeError extends Error {
}

export declare class Metadata {
    readonly clazz: Class;
    private static readonly _classNameMapMetadata;
    static getOrCreateMetadata(clazzOrPrototype: Class | object): Metadata;
    constructor(clazz: Class);
    injectable: boolean;
    readonly constructorParameterTypes: string[];
    fieldTypes: Record<string, string>;
    readonly parentClassNames: string[];
    merge(parent: Metadata): this;
}

export { }
