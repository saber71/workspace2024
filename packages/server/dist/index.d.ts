import { Class } from 'dependency-injection';
import { Container } from 'dependency-injection';
import { IncomingHttpHeaders } from 'node:http';
import { Metadata } from 'dependency-injection';
import { MethodParameterOption } from 'dependency-injection';
import { nodeFsPromises } from 'node:fs/promises';
import { nodePath } from 'node:path';
import { OutgoingHttpHeaders } from 'node:http';
import { ParsedUrlQuery } from 'node:querystring';
import { URL as URL_2 } from 'node:url';

export declare class AuthorizedGuard implements GuardInterface {
    guard(session: Session<RegularSessionData>, whiteList: string[], req: ServerRequest): void | Promise<void>;
}

export declare class ConsoleLogger implements LoggerInterface {
    readonly contextName: string;
    constructor(contextName: string);
    private readonly logLevelColorMap;
    log(level: LogLevel, message: string | Error | ServerRequest): void;
}

export declare const CONTEXT_LABEL = "ContextName";

export declare function Controller(option?: {
    routePrefix?: string;
} & MethodParameterOption): (clazz: Class, _?: any) => void;

export declare interface ControllerMethod {
    type: MethodType;
    methodName: string;
    routePrefix: string;
    route: string;
}

export declare const DEFAULT_PORT = 4000;

export declare class DuplicateRouteHandlerError extends ServerError {
    name: string;
}

export declare function Get(options?: WithoutTypeMethodOptions): (target: any, methodName?: any) => void;

export declare function getOrCreateControllerMethod(target: any, methodName: string): ControllerMethod;

export declare function getOrCreateMetadataUserData(obj: any): MetadataServerUserData;

export declare function Guard(): (clazz: Class, _?: any) => void;

export declare interface GuardInterface {
    guard(...args: any[]): void | Promise<void>;
}

export declare class ImproperDecoratorError extends ServerError {
    name: string;
}

export declare function Logger(): (clazz: Class<any>, ctx?: any) => void;

export declare interface LoggerInterface {
    log(level: LogLevel, message: string | Error | ServerRequest): void;
}

export declare type LogLevel = "log" | "error" | "warn" | "debug" | "verbose" | "fatal" | string;

export declare function MarkParseType(...clazz: Array<Class | null | undefined>): (target: any, propName?: any) => void;

export declare interface MetadataServerUserData {
    __server__: boolean;
    __server__classType: ServerClassType;
    __server__controllerRoutePrefix: string;
    __server__controllerMethods: Record<string, ControllerMethod>;
    __server__handle_error_type: Class<Error>;
    __server__propParseToType: Record<string, Array<Class | undefined | null>>;
}

export declare function Method(option?: MethodOptions): (target: any, methodName?: any) => void;

export declare type MethodOptions = Partial<Pick<ControllerMethod, "route" | "routePrefix" | "type">> & MethodParameterOption;

export declare type MethodParameterOptions = ParserAndValidator & {
    typeValueGetter: (container: Container) => any;
    afterExecute?: (metadata: Metadata, className: string, ...args: Array<string | number>) => void;
};

export declare type MethodType = "GET" | "POST" | "PUT" | "DELETE";

export declare const MODULE_NAME = "server";

export declare class NotFoundError extends ServerError {
    code: number;
    name: string;
}

export declare class NotFoundFileError extends ServerError {
    name: string;
}

export declare class NotFoundObjectError extends ServerError {
    code: number;
    name: string;
}

export declare class NotFoundRouteHandlerError extends ServerError {
    code: number;
    name: string;
}

export declare class NotFoundValidatorError extends ServerError {
    name: string;
}

export declare class ParseFailedError extends ServerError {
    name: string;
}

export declare function Parser(): (clazz: Class, _?: any) => void;

export declare interface ParserAndValidator {
    parsers?: Class<ParserInterface> | Class<ParserInterface>[] | null;
    validator?: boolean;
}

export declare interface ParserInterface {
    parse(value: any, ...clazz: Array<Class | undefined | null>): any;
}

export declare function Post(options?: WithoutTypeMethodOptions): (target: any, methodName?: any) => void;

export declare interface ProviderMetadata {
    [controllerClassName: string]: {
        [methodName: string]: {
            type: MethodType;
            url: string;
            parameters: Array<undefined | {
                isQuery?: boolean;
                isBody?: boolean;
                isFile?: string;
                isFiles?: string;
                isSession?: boolean;
                isReq?: boolean;
                isRes?: boolean;
            }>;
        };
    };
}

export declare class RegularParser implements ParserInterface {
    parse(value: any, ...clazz: Array<Class | undefined | null>): any;
}

export declare interface RegularSessionData {
    userId: string;
}

export declare function Req(): (clazz: any, propName: any, index?: any) => void;

export declare function ReqBody(option?: ParserAndValidator): (clazz: any, methodName: any, index: number) => void;

export declare function ReqFile(fieldName: string): (clazz: any, propName: any, index?: any) => void;

export declare function ReqFiles(fieldName: string): (clazz: any, propName: any, index?: any) => void;

export declare function ReqQuery(option?: ParserAndValidator): (clazz: any, methodName: any, index: number) => void;

export declare function ReqSession(): (clazz: any, propName: any, index?: any) => void;

export declare function Res(): (clazz: any, propName: any, index?: any) => void;

export declare interface ResponseBody<T = undefined> {
    code: number;
    object: T;
    success: boolean;
    msg: string;
}

export declare class ResponseBodyImpl implements ResponseBody {
    readonly object: any;
    readonly success: boolean;
    readonly code: number;
    readonly msg: string;
    static fromError(error: Error): ResponseBodyImpl;
    static from(value: any): ResponseBodyImpl;
    static fromFilePath(filePath: string): ResponseBodyImpl;
    constructor(object: any, success?: boolean, code?: number, msg?: string);
    send(res: ServerResponse): void | Promise<void>;
}

export declare interface ResponseBodySenderInterface {
    send(value: any, res: ServerResponse): void | Promise<void>;
}

export declare interface RouteHandler {
    controllerClass: Class;
    methodName: string;
}

export declare type RouteHandlerObject = {
    handle: (req: ServerRequest, res: ServerResponse) => any;
    catchError: (err: Error, req: ServerRequest, res: ServerResponse) => void | Promise<void>;
    methodTypes: Set<MethodType>;
};

export declare type RouteHandlerSet = Partial<Record<MethodType, RouteHandler | undefined>>;

export declare namespace RouteManager {
    export function getUrls(): IterableIterator<string>;
    /**
     * 获取url对应的请求类型
     * @throws NotFoundRouteHandlerError 当找不到url对应的RouteHandler时抛出
     */
    export function getMethodTypes(url: string): Set<MethodType>;
    /**
     * 保存路由url及其控制器方法
     * @throws DuplicateRouteHandlerError 当路由出现重复时抛出
     */
    export function register(type: MethodType, url: string, controllerClass: Class, methodName: string): void;
    /**
     * 查找路由url对应的控制器方法
     * @throws NotFoundRouteHandlerError 当找不到路由对应的控制器方法时抛出
     */
    export function getRouteHandler(methodType: MethodType, url: string): RouteHandler;
}

export declare type Routes = Record<string, RouteHandlerObject>;

export declare const RUNTIME = "runtime";

export declare function Runtime(): (clazz: any, methodName: any, index: number) => void;

export declare class Server<PlatformInstance extends object = object> {
    private readonly _serverPlatform;
    static create<PlatformInstance extends object = object>(options: ServerCreateOption<PlatformInstance>): Promise<Server<PlatformInstance>>;
    private constructor();
    private readonly _dependencyInjection;
    get dependencyInjection(): Container;
    private _platformInstance;
    get platformInstance(): PlatformInstance;
    private readonly _loggerClasses;
    private readonly _guardClasses;
    get guardClasses(): ReadonlyArray<Class<GuardInterface>>;
    log(logLevel: LogLevel, message: string | Error | ServerRequest): void;
    createContainer(): Container;
    bootstrap(option?: ServerBootstrapOption): void;
    /**
     * 支持静态资源
     * @param assetsPath 静态资源的文件夹路径
     * @param routePathPrefix 访问静态资源的路由前缀
     */
    staticAssets(assetsPath: string, routePathPrefix: string): this;
    proxy(option: ServerProxyOption): this;
    handleRequest(request: ServerRequest, response: ServerResponse): Promise<void>;
    private _init;
    private _setupRoutes;
    private _catchRequestError;
}

export declare interface ServerBootstrapOption {
    port?: number;
    hostname?: string;
    session?: {
        secretKey?: string;
        maxAge?: number | string;
    };
}

export declare type ServerClassType = "no-special" | "controller" | "parser" | "guard";

export declare interface ServerCreateOption<PlatformInstance extends object> {
    contextName?: string;
    serverPlatformAdapter: ServerPlatformAdapter<PlatformInstance>;
    runtime: ServerRuntimeAdapter;
    loggers?: Class<LoggerInterface>[];
    consoleLogger?: boolean;
    guards?: Class<GuardInterface>[];
}

export declare class ServerError extends Error {
    code: number;
    name: string;
    logLevel: LogLevel;
}

export declare interface ServerFile {
    /**
     * The size of the uploaded file in bytes. If the file is still being uploaded (see `'fileBegin'`
     * event), this property says how many bytes of the file have been written to disk yet.
     */
    size: number;
    /**
     * The path this file is being written to. You can modify this in the `'fileBegin'` event in case
     * you are unhappy with the way formidable generates a temporary path for your files.
     */
    filepath: string;
    /**
     * The name this file had according to the uploading client.
     */
    originalFilename: string | null;
    /**
     * Calculated based on options provided
     */
    newFilename: string;
}

export declare interface ServerPlatformAdapter<PlatformInstance extends object = object> {
    readonly name: string;
    create(): Promise<PlatformInstance>;
    useRoutes(routes: Routes): void;
    /**
     * 支持静态资源，可多次调用
     * @param assetsPath 静态资源的文件夹路径
     * @param routePathPrefix 访问静态资源的路由前缀
     */
    staticAssets(assetsPath: string, routePathPrefix: string): void;
    bootstrap(option: ServerBootstrapOption): void;
    proxy(option: ServerProxyOption): void;
}

export declare interface ServerProxyOption {
    src: string;
    target: string;
    changeOrigin?: boolean;
    rewrites?: Record<string, string>;
}

export declare class ServerRequest<Original extends object = object> {
    readonly original: Original;
    readonly id: string;
    readonly session: Readonly<Record<string, any>> | null;
    readonly headers: IncomingHttpHeaders;
    readonly body: any;
    readonly files: Record<string, ServerFile | ServerFile[] | undefined> | undefined;
    readonly url: string;
    readonly origin: string;
    readonly href: string;
    readonly method: MethodType;
    readonly path: string;
    readonly query: ParsedUrlQuery;
    readonly querystring: string;
    readonly search: string;
    readonly host: string;
    readonly hostname: string;
    readonly URL: URL_2;
}

export declare class ServerResponse<Original extends object = object> {
    readonly original: Original;
    readonly id: string;
    readonly headers: OutgoingHttpHeaders;
    session: Record<string, any> | null;
    statusCode: number;
    body(value?: any): void;
    sendFile(filePath: string): Promise<void>;
    redirect(url: string): void;
}

export declare interface ServerRuntimeAdapter {
    fs: nodeFsPromises;
    path: nodePath;
}

export declare class Session<T extends Record<string, any>> {
    readonly req: ServerRequest;
    readonly res: ServerResponse;
    constructor(req: ServerRequest, res: ServerResponse);
    deleteKey<Key extends keyof T>(key: Key): this;
    set<Key extends keyof T>(key: Key, value: T[Key]): this;
    get<Key extends keyof T>(key: Key): T[Key] | undefined;
    /**
     * 读取会话对象
     * @throws SessionKeyNotExistError 当在session上找不到key时抛出
     */
    fetch<Key extends keyof T>(key: Key): T[Key];
    has<Key extends keyof T>(key: Key): boolean;
    destroy(): void;
}

export declare class SessionKeyNotExistError extends ServerError {
    name: string;
}

export declare function ToArray(...valueClass: Class[]): (target: any, propName?: any) => void;

export declare function ToBoolean(): (target: any, propName?: any) => void;

export declare function ToDate(): (target: any, propName?: any) => void;

export declare function ToMap(valueClass?: Class): (target: any, propName?: any) => void;

export declare function ToNumber(): (target: any, propName?: any) => void;

export declare function ToObject(valueClass?: Class): (target: any, propName?: any) => void;

export declare function ToRegExp(): (target: any, propName?: any) => void;

export declare function ToSet(...valueClass: Class[]): (target: any, propName?: any) => void;

export declare function ToString(): (target: any, propName?: any) => void;

export declare class UnauthorizedError extends ServerError {
    code: number;
    name: string;
    logLevel: string;
    constructor(message?: string);
}

export declare class ValidateFailedError extends ServerError {
    name: string;
}

export declare const WHITE_LIST = "WhiteList";

export declare type WithoutTypeMethodOptions = Omit<MethodOptions, "type">;


export * from "class-validator";
export * from "dependency-injection";

export { }


export declare namespace RouteManager {
    function getUrls(): IterableIterator<string>;
    /**
     * 获取url对应的请求类型
     * @throws NotFoundRouteHandlerError 当找不到url对应的RouteHandler时抛出
     */
    function getMethodTypes(url: string): Set<MethodType>;
    /**
     * 保存路由url及其控制器方法
     * @throws DuplicateRouteHandlerError 当路由出现重复时抛出
     */
    function register(type: MethodType, url: string, controllerClass: Class, methodName: string): void;
    /**
     * 查找路由url对应的控制器方法
     * @throws NotFoundRouteHandlerError 当找不到路由对应的控制器方法时抛出
     */
    function getRouteHandler(methodType: MethodType, url: string): RouteHandler;
}

