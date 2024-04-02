import { AxiosInstance } from 'axios';
import { AxiosRequestConfig } from 'axios';

export declare class NotFoundControllerError extends Error {
}

export declare class NotFoundMethodError extends Error {
}

export declare class ServerApiProvider {
    readonly providerMetadata: ProviderMetadata;
    readonly axiosInstance: AxiosInstance;
    constructor(providerMetadata: ProviderMetadata, axiosInstance?: AxiosInstance);
    provider<T extends Record<string, any>>(key: string): <MethodName extends keyof T, Args extends Parameters<T[MethodName]>>(methodName: MethodName, parameters?: Partial<Args>, option?: AxiosRequestConfig) => Promise<ResponseBody<ExtractPromiseGenericType<ReturnType<T[MethodName]>>>>;
    request<T extends Record<string, any>, MethodName extends keyof T, Args extends Parameters<T[MethodName]>>(key: string, methodName: MethodName, parameters?: Partial<Args>, option?: AxiosRequestConfig): Promise<ResponseBody<ExtractPromiseGenericType<ReturnType<T[MethodName]>>>>;
}

export { }
