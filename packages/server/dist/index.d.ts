export declare function Controller(): void;

export declare const DEFAULT_PORT = 4000;

export declare const MODULE_NAME = "server";

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

export { }
