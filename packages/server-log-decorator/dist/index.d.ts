import { Container } from 'server';
import { StoreItem } from 'server-store';

export declare interface LogModel extends StoreItem {
    creator: string;
    createTime: number;
    description: string;
    query: any;
    body: any;
    url: string;
    data?: any;
}

export declare const SERVER_LOG_COLLECTION = "server-log-collection";

export declare function ServerLog(description: string, options?: {
    creatorGetter?: any | ((container: Container) => any);
    data?: any | ((container: Container) => any);
}): (target: any, methodName: any) => void;

export { }
