/// <reference types="../types.d.ts" />
/// <reference types="common/types.d.ts" />
/// <reference types="server/types.d.ts" />

import type { AxiosInstance } from 'axios';
import type { AxiosRequestConfig } from 'axios';

export declare function controllerKey<T>(name: string): ControllerKey<T>;

export declare class NotFoundControllerError extends Error {
}

export declare class NotFoundMethodError extends Error {
}

export declare class ServerApiProvider {
    readonly axiosInstance: AxiosInstance;
    readonly providerMetadata: ProviderMetadata;
    constructor(axiosInstance: AxiosInstance, providerMetadata: ProviderMetadata);
    request<T extends Record<string, () => any>, MethodName extends keyof T>(key: ControllerKey<T>, methodName: MethodName, parameters: Parameters<T[MethodName]>, option?: AxiosRequestConfig): Promise<RegularResponseBody<ExtractPromiseGenericType<ReturnType<T[MethodName]>>>>;
}

export { }
