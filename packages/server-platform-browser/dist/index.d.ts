import { MethodType } from 'server';
import { RouteHandlerObject } from 'server';
import { ServerPlatformAdapter } from 'server';
import { ServerProxyOption } from 'server';
import { ServerRequest } from 'server';
import { ServerResponse } from 'server';
import { ServerRuntimeAdapter } from 'server';

export declare interface App {
    runtime: ServerRuntimeAdapter;
    apply(url: string, option?: AppApplyOption): Promise<{
        data: any;
        status: number;
        headers: Record<string, any>;
    }>;
}

export declare interface AppApplyOption {
    headers?: any;
    body?: any;
    method?: MethodType;
}

export declare function createServerPlatformBrowser(runtime: ServerRuntimeAdapter): ServerPlatformAdapter<App>;

export declare function createServerRequest(id: string, original: App, req: {
    url: string;
    body: any;
    method: MethodType;
    headers: Record<string, any>;
    files: Record<string, File | File[]>;
}): ServerRequest;

export declare function createServerResponse(id: string, original: App, req: ServerRequest, callback: (body: any) => void): ServerResponse;

export declare interface UrlOption {
    type: "route" | "assets" | "proxy";
    filePath?: string;
    routeHandler?: RouteHandlerObject;
    proxy?: ServerProxyOption;
}

export { }
