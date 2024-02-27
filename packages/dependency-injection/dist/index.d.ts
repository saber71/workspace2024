export declare class Container {
    protected readonly _memberMap: Map<string, ContainerMember>;
    private _extend?;
    extend(parent?: Container): this;
    /**
     * 给指定的标识符绑定值
     * @param label 标识符
     * @param value 指定的值
     * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
     */
    bindValue(label: string, value: any): this;
    bindFactory(label: string, value: (...args: any[]) => any): this;
    bindGetter(label: string, value: () => any): this;
    unbind(label: string): this;
    unbindAll(): void;
    dispose(): void;
    /**
     * 获取指定标识符的值
     * @param label 要获取值的标识符
     * @param args 生成值所需的参数
     * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
     * @throws NotExistLabelError 当从容器访问一个不存在的标识符时抛出
     */
    getValue<T>(label: string | Class<T>, ...args: any[]): T;
    protected _newMember(name: string, metadata?: Metadata): ContainerMember;
}

export declare class ContainerRepeatLoadError extends Error {
}

export declare class DependencyCycleError extends Error {
}

export declare function fillInMethodParameterTypes(parameterTypes: MethodParameterTypes, option?: MethodParameterOption, types?: Function[]): void;

export declare function getDecoratedName(ctx?: string | ClassMemberDecoratorContext): string | symbol;

/**
 * 参数装饰器、属性装饰器，方法装饰器
 * @param option.typeLabel 指定被装饰的字段或入参的类型。当被装饰的是类的字段或入参时才生效
 * @param option.typeValueGetter 指定被装饰的字段或入参的自定义getter。当被装饰的是类的字段或入参时才生效
 * @throws InjectNotFoundTypeError 在无法确定被装饰者的类型时抛出
 */
export declare function Inject(option?: {
    typeLabel?: string;
    typeValueGetter?: TypeValueGetter;
} & MethodParameterOption): (clazz: any, propName: ClassFieldDecoratorContext | any, index?: number) => void;

/**
 * 类装饰器
 * @param option.moduleName 可选。指定类所属的模块名
 * @param option.singleton 可选。指定类是否是单例的
 * @param option.createImmediately 可选。类是否立即实例化
 */
export declare function Injectable(option?: {
    moduleName?: string;
    singleton?: boolean;
    createImmediately?: boolean;
} & MethodParameterOption): (clazz: Class, ctx?: any) => void;

export declare class InjectNotFoundTypeError extends Error {
}

export declare class InvalidValueError extends Error {
}

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
    private _getMethodParameters;
    private _getFieldValue;
}

export declare class Metadata {
    readonly clazz: Class;
    private static readonly _classNameMapMetadata;
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
    readonly methodNameMapParameterTypes: Record<string | "constructor", MethodParameterTypes>;
    private _fieldTypes;
    get fieldTypes(): Record<string, FieldType>;
    readonly parentClassNames: string[];
    private _userData;
    get userData(): Record<string, any>;
    merge(parent: Metadata): this;
    getMethodParameterTypes(methodName?: string): MethodParameterTypes;
}

export declare class NotExistLabelError extends Error {
}

export { }
