/// <reference types="dependency-injection/types" />

import { IncomingHttpHeaders } from 'node:http';
import { OutgoingHttpHeaders } from 'node:http';
import { ParsedUrlQuery } from 'node:querystring';
import { URL as URL_2 } from 'node:url';

export declare function Controller(option?: {
    routePrefix?: string;
}): (clazz: Class, _?: any) => void;

export declare const DEFAULT_PORT = 4000;

export declare function Method(option?: {
    type: MethodType;
    routePrefix?: string;
    route?: string;
    paramtypes?: Record<number, string>;
}): (target: any, methodName?: any) => void;

export declare const MODULE_NAME = "server";

export declare function ParamType(option: {
    label: string;
}): (target: any, methodName: any, index: number) => void;

export declare const PARAMTYPES_REQUEST = "__server__request";

export declare const PARAMTYPES_REQUEST_BODY = "__server__request_body";

export declare const PARAMTYPES_REQUEST_QUERY = "__server__request_query";

export declare const PARAMTYPES_RESPONSE = "__server__response";

export declare function Req(): (target: any, methodName: any, index: number) => void;

export declare function ReqBody(): (target: any, methodName: any, index: number) => void;

export declare function ReqQuery(): (target: any, methodName: any, index: number) => void;

export declare function Res(): (target: any, methodName: any, index: number) => void;

export declare class Server<PlatformInstance extends object = object> {
    private readonly _serverPlatform;
    static create(serverPlatform: ServerPlatformAdapter): Promise<Server<object>>;
    private constructor();
    private readonly _dependencyInjection;
    private _platformInstance;
    get platformInstance(): PlatformInstance;
    bootstrap(option?: ServerBootstrapOption): Promise<void>;
    private _init;
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
     * Set pathname, retaining the query-string when present.
     */
    readonly path: string;
    /**
     * Get parsed query-string.
     * Set query-string as an object.
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


export * from "dependency-injection";

export { }
