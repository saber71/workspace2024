import { Container } from 'server';

export declare const SERVER_LOG_ADDRESS = "server-log-address";

export declare function ServerLog(description: string, options?: {
    creatorGetter?: any | ((container: Container) => any);
    data?: any | ((container: Container) => any);
}): (target: any, methodName: any) => void;

export { }
