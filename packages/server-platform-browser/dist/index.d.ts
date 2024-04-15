import { ServerRequest } from 'server';
import { ServerResponse } from 'server';

export declare function createServerPlatformBrowser(runtime: ServerRuntimeAdapter): ServerPlatformAdapter<App>;

export declare function createServerRequest(id: string, original: App, req: {
    url: string;
    body: any;
    method: MethodType;
    headers: Record<string, any>;
    files: Record<string, File | File[]>;
}): ServerRequest;

export declare function createServerResponse(id: string, original: App, req: ServerRequest, callback: (body: any) => void): ServerResponse;

export { }
