import { Server } from 'server';

export declare function createServer<PlatformInstance extends object>(option: CreateServerOption<PlatformInstance>): Promise<Server<PlatformInstance>>;


export * from "server";
export * from "server-log-decorator";
export * from "server-store";

export { }
