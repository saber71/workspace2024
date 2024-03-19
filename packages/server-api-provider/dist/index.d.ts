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
    readonly providerMetadata: ProviderMetadata;
    readonly axiosInstance: AxiosInstance;
    constructor(providerMetadata: ProviderMetadata, axiosInstance?: AxiosInstance);
    request<T extends Record<string, any>, MethodName extends keyof T, Args extends Parameters<T[MethodName]>>(key: ControllerKey<T>, methodName: MethodName, parameters: Partial<Args>, option?: AxiosRequestConfig): Promise<RegularResponseBody<ExtractPromiseGenericType<ReturnType<T[MethodName]>>>>;
}

export { }
