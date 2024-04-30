import { StoreAdapter } from 'server-store';
import { StoreItem } from 'server-store';

export declare interface Collection {
    path: string;
    data: Record<string, StoreItem>;
}

export declare function createServerStoreFS(basePath?: string, saveOnExit?: boolean): StoreAdapter;

export { }
