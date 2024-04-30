import { Server } from 'server';
import { ServerBootstrapOption } from 'server';
import { ServerCreateOption } from 'server';
import { ServerRuntimeAdapter } from 'server';
import { StoreAdapter } from 'server-store';

export declare function createServer<PlatformInstance extends object>(option: CreateServerOption<PlatformInstance>): Promise<Server<PlatformInstance>>;

export declare interface CreateServerOption<PlatformInstance extends object> extends ServerCreateOption<PlatformInstance> {
    contextName: string;
    runtime: ServerRuntimeAdapter;
    storeAdapter: StoreAdapter;
    whiteList?: string[];
    log?: {
        serverLogCollection: string;
    };
    bootstrapOption?: ServerBootstrapOption;
}


export * from "server";
export * from "server-log-decorator";
export * from "server-store";

export { }
