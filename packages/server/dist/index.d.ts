/// <reference types="../types.d.ts" />
/// <reference types="dependency-injection/types" />
/// <reference types="node" />

import { Container } from 'dependency-injection';
import type { IncomingHttpHeaders } from 'node:http';
import type { OutgoingHttpHeaders } from 'node:http';
import type { ParsedUrlQuery } from 'node:querystring';
import type { URL as URL_2 } from 'node:url';

export declare function composeUrl(...items: string[]): string;

export declare function Controller(option?: {
    routePrefix?: string;
} & MethodParameterOption): (clazz: Class, _?: any) => void;

export declare const DEFAULT_PORT = 4000;

export declare class DuplicateRouteHandlerError extends ServerError {
}

export declare function ErrorHandler<T extends Error>(errorClass: Class<T>): (clazz: Class, _?: any) => void;

export declare class ErrorHandlerDispatcher {
    private readonly _errorHandlerClasses;
    constructor(customErrorHandlers: ErrorHandlerClass[]);
    dispatch(error: Error): ErrorHandlerClass | undefined;
    private _checkErrorHandlers;
}

export declare function getOrCreateControllerMethod(target: any, methodName: string): ControllerMethod;

export declare function getOrCreateMetadataUserData(obj: any): MetadataServerUserData;

export declare class ImproperDecoratorError extends ServerError {
}

export declare function Method(option?: Partial<Pick<ControllerMethod, "route" | "routePrefix" | "type">> & MethodParameterOption): (target: any, methodName?: any) => void;

export declare const MODULE_NAME = "server";

export declare class NotFoundFileError extends ServerError {
}

export declare class NotFoundRouteHandlerError extends ServerError {
    code: number;
}

export declare function parse(container: Container, parsers: Class<ParserInterface> | Class<ParserInterface>[] | null | undefined, value: any): any;

export declare function Parser(): (clazz: Class, _?: any) => void;

export declare function Pipeline(): (clazz: Class, _?: any) => void;

export declare class RegularParser implements ParserInterface {
    parse(value: any): any;
}

export declare class RegularResponseBodySender implements ResponseBodySenderInterface {
    send(value: any, res: ServerResponse): Promise<void> | undefined;
}

export declare function removeHeadTailSlash(str: string): string;

export declare function Req(): (clazz: any, propName: any, index?: any) => void;

export declare function ReqBody(): (clazz: any, propName: any, index?: any) => void;

export declare function ReqFile(fieldName: string): (clazz: any, propName: any, index?: any) => void;

export declare function ReqFiles(fieldName: string): (clazz: any, propName: any, index?: any) => void;

export declare function ReqQuery(option?: {
    parsers?: Class<ParserInterface> | Class<ParserInterface>[] | null;
}): (clazz: any, propName: any, index?: any) => void;

export declare function ReqSession(): (clazz: any, propName: any, index?: any) => void;

export declare class RequestPipeline {
    readonly server: Server;
    readonly request: ServerRequest;
    readonly response: ServerResponse;
    constructor(server: Server, request: ServerRequest, response: ServerResponse);
    private readonly _container;
    start(): Promise<void>;
    dispose(): void;
}

export declare function Res(): (clazz: any, propName: any, index?: any) => void;

export declare class ResponseBody {
    readonly object: any;
    readonly success: boolean;
    readonly code: number;
    readonly message: string;
    static fromError(error: Error): ResponseBody;
    static from(value: any): ResponseBody;
    static fromFilePath(filePath: string): ResponseBody;
    constructor(object: any, success?: boolean, code?: number, message?: string);
}

export declare function ResponseBodySender(): (clazz: Class, _?: any) => void;

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

export declare class Server<PlatformInstance extends object = object> {
    private readonly _serverPlatform;
    static create(options: ServerCreateOption): Promise<Server<object>>;
    private constructor();
    private readonly _dependencyInjection;
    private _requestPipelineClass;
    private _platformInstance;
    get platformInstance(): PlatformInstance;
    private _errorHandlerDispatcher;
    get errorHandlerDispatcher(): ErrorHandlerDispatcher;
    private _responseBodySender;
    get responseBodySender(): ResponseBodySenderInterface;
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

export declare class ServerError extends Error {
    code: number;
}

export declare class ServerRequest<Original extends object = object> {
    readonly original: Original;
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
    readonly headers: OutgoingHttpHeaders;
    session: Record<string, any> | null;
    statusCode: number;
    body(value?: any): void;
    sendFile(filePath: string): Promise<void>;
    redirect(url: string): void;
}

export declare class Session<T extends Record<string, any>> {
    readonly req: ServerRequest;
    readonly res: ServerResponse;
    constructor(req: ServerRequest, res: ServerResponse);
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
}


export * from "dependency-injection";

export { }
