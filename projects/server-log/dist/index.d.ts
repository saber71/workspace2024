/// <reference types="../types.d.ts" />
/// <reference types="server-store/types" />

import { Container } from 'server';
import { StoreCollection } from 'server-store';

export declare function bootstrap(port: number, saveOnExit?: boolean): Promise<void>;

export declare const COLLECTION_LOG = "collected-log";

export declare const CONTEXT_NAME = "server-log";

export declare class Controller {
    create(data: CreateLogDTO, collection: StoreCollection<LogModel>): Promise<void>;
    find(condition: FilterCondition<LogModel>, collection: StoreCollection<LogModel>): Promise<LogModel[]>;
}

declare class CreateLogDTO {
    creator: string;
    description: string;
    data?: any;
}

export declare const SERVER_LOG_ADDRESS = "server-log-address";

export declare function ServerLog(description: string, options?: {
    creatorGetter?: (container: Container) => string;
    data?: any | ((container: Container) => any);
}): (target: any, methodName: any) => void;

export { }
