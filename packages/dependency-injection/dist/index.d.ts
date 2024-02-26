/**
 * 用来管理需要进行依赖注入的实例的容器
 * @throws DependencyCycleError 当依赖循环时抛出
 */
export declare class Container {
    private _loaded;
    private readonly _memberMap;
    private _extend?;
    extend(parent?: Container): this;
    /**
     * 加载所有已被装饰器Injectable装饰的类且所属于指定的模块
     * @param option.moduleName 可选。指定要被加载的模块，与装饰器Injectable入参中的moduleName相同
     * @param option.overrideParent 默认true。是否让子类覆盖父类的实例。如果为true，则通过父类名字拿到的，并非是其自身的实例，而是子类的实例
     * @throws ContainerRepeatLoadError 当重复调用Container.load方法时抛出
     */
    load(option?: {
        moduleName?: string;
        overrideParent?: boolean;
    }): void;
    /**
     * 给指定的标识符绑定值
     * @param label 标识符
     * @param value 指定的值
     * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
     */
    bindValue(label: string, value: any): this;
    bindFactory(label: string, value: () => any): this;
    bindGetter(label: string, value: () => any): this;
    unbind(label: string): this;
    /**
     * 获取指定标识符的值
     * @param label 要获取值的标识符
     * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
     * @throws NotExistLabelError 当从容器访问一个不存在的标识符时抛出
     */
    getValue<T>(label: string | Class<T>): T;
    private _newMember;
}

export declare class ContainerRepeatLoadError extends Error {
}

export declare class DependencyCycleError extends Error {
}

export declare function getDecoratedName(ctx?: string | ClassMemberDecoratorContext): string | symbol;

/**
 * 构造函数参数装饰器、字段装饰器
 * @param typeLabel 指定这个字段/参数的类型
 * @throws InjectNotFoundTypeError 在无法确定被装饰者的类型时抛出
 */
export declare function Inject(typeLabel?: string): (clazz: any, propName: ClassFieldDecoratorContext | any, index?: number) => void;

/**
 * 类装饰器
 * @param option.paramtypes 可选。指定部分或全部构造函数入参的类型，就好像是使用装饰器Inject去装饰参数。装饰器Inject优先级更高。key为入参的序号，value为入参类型
 * @param option.moduleName 可选。指定类所属的模块名
 * @param option.singleton 可选。指定类是否是单例的
 * @param option.createImmediately 可选。类是否立即实例化
 */
export declare function Injectable(option?: {
    paramtypes?: Record<number, string>;
    moduleName?: string;
    singleton?: boolean;
    createImmediately?: boolean;
}): (clazz: Class, ctx?: any) => void;

export declare class InjectNotFoundTypeError extends Error {
}

export declare class InvalidValueError extends Error {
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
    readonly constructorParameterTypes: string[];
    fieldTypes: Record<string, string>;
    readonly parentClassNames: string[];
    private _userData;
    get userData(): Record<string, any>;
    merge(parent: Metadata): this;
}

export declare class NotExistLabelError extends Error {
}

export { }
