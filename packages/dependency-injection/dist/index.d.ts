import { default as default_2 } from 'eventemitter3';

export declare function AfterCallMethod(cb: InjectOptions["afterCallMethod"]): (target: any, methodName: any) => void;

export declare function BeforeCallMethod(cb: InjectOptions["beforeCallMethod"]): (target: any, methodName: any) => void;

export declare type Class<T = any> = {
    new (...args: any[]): T;
};

export declare class Container extends default_2<{
    loadClass: (clazz: Class, member: ContainerMember) => void;
}> {
    protected readonly _memberMap: Map<string, ContainerMember>;
    private _extend?;
    /**
     * 设置要继承的父容器。当从容器中找不到值时，会尝试在父容器中寻找
     * 会继承父容器中的可依赖注入对象，并将生成实例时的上下文环境替换成此实例
     * 在取消继承时删除之
     */
    extend(parent?: Container): this;
    private _onLoadClass;
    private _extendMember;
    bindInstance<T extends object>(instance: T): this;
    /**
     * 给指定的标识符绑定值
     * @param label 标识符
     * @param value 指定的值
     * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
     * @throws ForbiddenOverrideInjectableError 当要覆盖可依赖注入的对象时抛出
     */
    bindValue<T = any>(label: string | ContainerLabel<T>, value: T): this;
    /**
     * 给指定的标识符绑定一个工厂函数，在每次访问时生成一个新值
     * @throws ForbiddenOverrideInjectableError 当要覆盖可依赖注入的对象时抛出
     */
    bindFactory<T = any>(label: string | ContainerLabel<T>, value: (...args: any[]) => T, context?: any): this;
    /**
     * 给指定的标识符绑定一个getter，只在第一次访问时执行
     * @throws ForbiddenOverrideInjectableError 当要覆盖可依赖注入的对象时抛出
     */
    bindGetter<T = any>(label: string | ContainerLabel<T>, value: () => T, context?: any): this;
    unbind(label: string): this;
    unbindAll(): void;
    dispose(): void;
    hasLabel(label: string): boolean;
    /**
     * 获取指定标识符的值
     * @param label 要获取值的标识符
     * @param args 生成值所需的参数
     * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
     * @throws NotExistLabelError 当从容器访问一个不存在的标识符时抛出
     */
    getValue<T>(label: string | Class<T> | ContainerLabel<T>, ...args: any[]): T;
    /**
     * 调用方法，其入参必须支持依赖注入
     * @throws MethodNotDecoratedInjectError 试图调用一个未装饰Inject的方法时抛出
     */
    call<T extends object>(instance: T, methodName: keyof T): Promise<any>;
    /**
     * 调用方法，其入参必须支持依赖注入
     * @throws MethodNotDecoratedInjectError 试图调用一个未装饰Inject的方法时抛出
     */
    callSync<T extends object>(instance: T, methodName: keyof T): any;
    protected _getMethodParameters(parameters?: MethodParameterTypes): any[];
    protected _newMember(name: string, metadata?: Metadata): ContainerMember;
}

export declare interface ContainerLabel<T> extends Symbol {
}

export declare function containerLabel<T>(label: string): ContainerLabel<T>;

export declare interface ContainerMember {
    name: string;
    metadata?: Metadata;
    value?: any;
    factory?: (...args: any[]) => any;
    factoryContext?: any;
    getter?: () => any;
    getterContext?: any;
    getterValue?: any;
    isExtend?: boolean;
}

export declare class ContainerRepeatLoadError extends Error {
}

export declare class DependencyCycleError extends Error {
}

export declare interface FieldType {
    type?: string;
    getter?: TypeValueGetter;
}

export declare function fillInMethodParameterTypes(parameterTypes: MethodParameterTypes, option?: MethodParameterOption, types?: Function[]): void;

export declare class ForbiddenOverrideInjectableError extends Error {
}

export declare function getDecoratedName(ctx?: string | ClassMemberDecoratorContext): string | symbol;

/**
 * 参数装饰器、属性装饰器，方法装饰器。
 * 当装饰方法时，获取方法的入参类型。当装饰属性时，获取数的入参类型。当装饰方法的入参时，用来指定该入参的类型，会覆盖方法装饰器中所指定的类型
 * @param option.typeLabel 指定被装饰的字段或入参的类型。当被装饰的是类的字段或入参时才生效
 * @param option.typeValueGetter 指定被装饰的字段或入参的自定义getter。当被装饰的是类的字段或入参时才生效
 * @throws InjectNotFoundTypeError 在无法确定被装饰者的类型时抛出
 */
export declare function Inject(option?: InjectOptions | string): (clazz: any, propName: ClassFieldDecoratorContext | any, index?: any) => void;

/**
 * 类装饰器。获取类的构造函数的入参类型，标记该类可以被依赖注入
 * 如果父类没有用Injectable装饰，那么子类就必须要声明构造函数，否则的话无法通过元数据得到子类正确的构造函数入参类型
 */
export declare function Injectable(option?: InjectableOptions): (clazz: Class, ctx?: any) => void;

export declare interface InjectableOptions extends MethodParameterOption {
    moduleName?: string;
    singleton?: boolean;
    createImmediately?: boolean;
    overrideConstructor?: boolean;
    overrideParent?: boolean;
    onCreate?: (instance: object) => void;
}

export declare class InjectNotFoundTypeError extends Error {
}

export declare interface InjectOptions extends MethodParameterOption {
    typeLabel?: string;
    typeValueGetter?: TypeValueGetter;
    afterExecute?: (metadata: Metadata, className: string, ...args: Array<string | number>) => void;
    beforeCallMethod?: (container: Container, metadata: Metadata, args: any[]) => void | Promise<void>;
    afterCallMethod?: (container: Container, metadata: Metadata, returnValue: any, args: any[], error?: Error) => any | Promise<any>;
}

export declare class InvalidValueError extends Error {
}

export declare function isContainerLabel<T>(arg: any): arg is ContainerLabel<T>;

/**
 * 负责实现依赖注入的核心功能，包括得到依赖关系、生成实例、向实例注入依赖
 * @throws DependencyCycleError 当依赖循环时抛出
 */
export declare class LoadableContainer extends Container {
    private _loaded;
    /**
     * 加载所有已被装饰器Injectable装饰的类且所属于指定的模块
     * @throws ContainerRepeatLoadError 当重复调用Container.load方法时抛出
     */
    load(option?: LoadOption): void;
    loadFromMetadata(metadataArray: Metadata[], option?: LoadOption): void;
    loadFromClass(clazz: Class[], option?: LoadOption): void;
    private _getFieldValue;
}

export declare interface LoadOption {
    moduleName?: string;
    overrideParent?: boolean;
}

export declare class Metadata {
    readonly clazz: Class;
    private static readonly _classNameMapMetadata;
    static isBasicType(type: Class): boolean;
    static getAllMetadata(): IterableIterator<Metadata>;
    /**
     * 获取类对应的Metadata对象，如果对象不存在就新建一个。在新建Metadata对象的时候，子类的Metadata对象会合并父类的Metadata对象
     * @param clazzOrPrototype 可以是类或是类的原型
     */
    static getOrCreateMetadata(clazzOrPrototype: Class | object): Metadata;
    constructor(clazz: Class);
    injectable: boolean;
    moduleName?: string;
    singleton?: boolean;
    createImmediately?: boolean;
    copiedConstructorParams: boolean;
    onCreate?: (instance: object) => void;
    overrideParent?: boolean;
    readonly methodNameMapParameterTypes: Record<string, MethodParameterTypes>;
    private _fieldTypes;
    get fieldTypes(): Record<string, FieldType>;
    readonly parentClassNames: string[];
    private _userData;
    get userData(): Record<string, any>;
    getMethodParameterTypes(methodName?: string): MethodParameterTypes;
    private _merge;
}

export declare class MethodNotDecoratedInjectError extends Error {
}

export declare interface MethodParameterOption {
    paramtypes?: Record<number, string> | Array<string>;
    paramGetters?: Record<number, TypeValueGetter> | Array<TypeValueGetter>;
}

export declare interface MethodParameterTypes {
    types: string[];
    getters: Record<number, TypeValueGetter>;
    beforeCallMethods: InjectOptions["beforeCallMethod"][];
    afterCallMethods: InjectOptions["afterCallMethod"][];
}

export declare class NotExistLabelError extends Error {
}

export declare type TypeValueGetter = (container: Container) => any;

export { }
