/// <reference types="dependency-injection/types" />

import { Container } from 'dependency-injection';
import { IncomingHttpHeaders } from 'node:http';
import { OutgoingHttpHeaders } from 'node:http';
import { ParsedUrlQuery } from 'node:querystring';
import { URL as URL_2 } from 'node:url';

export declare function composeUrl(...items: string[]): string;

export declare function Controller(option?: {
    routePrefix?: string;
}): (clazz: Class, _?: any) => void;

export declare const DEFAULT_PORT = 4000;

declare function ErrorHandler_2<T extends Error>(errorClass: Class<T>): (clazz: Class, _?: any) => void;
export { ErrorHandler_2 as ErrorHandler }

export declare function getOrCreateControllerMethod(target: any, methodName: string): ControllerMethod;

export declare function getOrCreateMetadataUserData(obj: any): MetadataServerUserData;

export declare class ImproperDecoratorError extends Error {
}

export declare function Method(option?: {
    type: MethodType;
    routePrefix?: string;
    route?: string;
    paramtypes?: Record<number, string>;
}): (target: any, methodName?: any) => void;

export declare const MODULE_NAME = "server";

export declare class NotFoundFileError extends Error {
}

export declare class NotFountRouteHandlerError extends ServerError {
}

export declare function ParamType(option: {
    label: string;
    getter?: (container: Container) => any;
}): (target: any, methodName: any, index: number) => void;

export declare const PARAMTYPES_FILE = "__server__request_file";

export declare const PARAMTYPES_FILES = "__server__request_files";

export declare const PARAMTYPES_REQUEST = "__server__request";

export declare const PARAMTYPES_REQUEST_BODY = "__server__request_body";

export declare const PARAMTYPES_REQUEST_QUERY = "__server__request_query";

export declare const PARAMTYPES_RESPONSE = "__server__response";

export declare const PARAMTYPES_SESSION = "__server__request_session";

export declare function Pipeline(): (clazz: Class, _?: any) => void;

export declare function removeHeadTailSlash(str: string): string;

export declare function Req(): (target: any, methodName: any, index: number) => void;

export declare function ReqBody(): (target: any, methodName: any, index: number) => void;

export declare function ReqFile(fieldName: string): (target: any, methodName: any, index: number) => void;

export declare function ReqFiles(fieldName: string): (target: any, methodName: any, index: number) => void;

export declare function ReqQuery(): (target: any, methodName: any, index: number) => void;

export declare function ReqSession(): (target: any, methodName: any, index: number) => void;

export declare class RequestPipeline {
    readonly container: Container;
    readonly request: ServerRequest;
    readonly response: ServerResponse;
    constructor(container: Container, request: ServerRequest, response: ServerResponse);
    start(): void;
    dispose(): void;
}

export declare function Res(): (target: any, methodName: any, index: number) => void;

declare class RouteHandler_2<Controller extends object = object> {
    readonly controller: Controller;
    readonly methodName: string;
    constructor(controller: Controller, methodName: string);
    /**
     * 执行方法
     * @param container 依赖注入容器
     */
    call(container: Container): any;
}
export { RouteHandler_2 as RouteHandler }

export declare class Server<PlatformInstance extends object = object> {
    private readonly _serverPlatform;
    static create(serverPlatform: ServerPlatformAdapter): Promise<Server<object>>;
    private constructor();
    private readonly _routeHandlerMap;
    private readonly _dependencyInjection;
    private _platformInstance;
    get platformInstance(): PlatformInstance;
    createContainer(): Container;
    bootstrap(option?: ServerBootstrapOption): Promise<void>;
    /**
     * 根据请求的path获取对应的路由处理对象
     * @throws NotFountRouteHandlerError 找不到路由处理对象时抛出
     */
    getRouteHandler(path: string): RouteHandler_2<object>;
    private _init;
}

export declare const SERVER_LABEL = "Server";

export declare class ServerError extends Error {
}

export declare class ServerErrorHandler implements ErrorHandler<ServerError> {
    handle(err: ServerError, res: ServerResponse): void | Promise<void>;
}

export declare class ServerRequest<Original extends object = object> {
    readonly original: Original;
    readonly session: Readonly<Record<string, any>> | null;
    readonly headers: IncomingHttpHeaders;
    readonly body: any;
    readonly files: Record<string, ServerFile | ServerFile[] | undefined> | undefined;
    readonly url: string;
    /**
     * Get origin of URL.
     */
    readonly origin: string;
    /**
     * Get full request URL.
     */
    readonly href: string;
    /**
     * Get request method.
     */
    readonly method: string;
    /**
     * Get request pathname.
     */
    readonly path: string;
    /**
     * Get parsed query-string.
     */
    readonly query: ParsedUrlQuery;
    /**
     * Get query string.
     */
    readonly querystring: string;
    /**
     * Get the search string. Same as the querystring
     * except it includes the leading ?.
     */
    readonly search: string;
    /**
     * Parse the "Host" header field host
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
    readonly host: string;
    /**
     * Parse the "Host" header field hostname
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
    readonly hostname: string;
    /**
     * Get WHATWG parsed URL object.
     */
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

export declare class Session<T extends object> {
    readonly req: ServerRequest;
    readonly res: ServerResponse;
    constructor(req: ServerRequest, res: ServerResponse);
    set<Key extends keyof T>(key: Key, value: T[Key]): this;
    get<Key extends keyof T>(key: Key): T[Key] | undefined;
    fetch<Key extends keyof T>(key: Key): T[Key];
    has<Key extends keyof T>(key: Key): boolean;
    destroy(): void;
}

export declare class SessionKeyNotExistError extends ServerError {
}


export * from "dependency-injection";

export { }
