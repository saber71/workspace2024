import { Container } from 'inversify';
import { DecoratorTarget } from 'inversify/lib/annotation/decorator_utils';

declare type Class<T = any> = {
    new (...args: any[]): T;
};

export declare namespace IoC {
    export interface InjectableOption {
        createOnLoad: boolean;
        moduleName?: string;
        prototypeNames: string[];
        singleton: boolean;
        targetClass: Class;
        onCreate?: (instance: any) => void;
    }
    export function getContainer(moduleName?: string): Container;
    export function Injectable(option?: Partial<InjectableOption>): (clazz: Class, _: any) => void;
    export function Inject(label: string): (target: DecoratorTarget<unknown>, targetKey?: string | symbol | undefined, indexOrPropertyDescriptor?: number | TypedPropertyDescriptor<unknown> | undefined) => void;
    export function load(moduleName?: string): void;
    export function unload(moduleName?: string): void;
    export function getInstance<T>(clazz: Class<T>, moduleName?: string): T;
    export function importAll(importMethod: () => Record<string, (() => Promise<any> | any) | Promise<any> | any>): Promise<void>;
}

export { }
