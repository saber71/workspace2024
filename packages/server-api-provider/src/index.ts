///<reference types="../types.d.ts"/>

import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import FormData from "form-data";

export function controllerKey<T>(name: string): ControllerKey<T> {
  return Symbol(name);
}

export class ServerApiProvider {
  constructor(
    readonly providerMetadata: ProviderMetadata,
    readonly axiosInstance: AxiosInstance = axios,
  ) {}

  async request<
    T extends Record<string, any>,
    MethodName extends keyof T,
    Args extends Parameters<T[MethodName]>,
  >(
    key: ControllerKey<T>,
    methodName: MethodName,
    parameters: Partial<Args>,
    option?: AxiosRequestConfig,
  ): Promise<
    RegularResponseBody<ExtractPromiseGenericType<ReturnType<T[MethodName]>>>
  > {
    const methodSet = this.providerMetadata[key.description!];
    if (!methodSet)
      throw new NotFoundControllerError(
        `找不到名为${key.description!}的控制器数据`,
      );
    const method = methodSet[methodName as string];
    if (!method)
      throw new NotFoundMethodError(
        `在控制器内找不到名为${methodName as string}的方法数据`,
      );

    let params: any;
    let data: any;
    for (let i = 0; i < parameters.length; i++) {
      const parameter = parameters[i];
      const typeInfo = method.parameters[i];
      if (!typeInfo) {
        if (method.type === "GET") params = parameter;
        else data = parameters;
        continue;
      }
      const fileFieldName = typeInfo.isFiles || typeInfo.isFile;
      if (fileFieldName) {
        const formData = new FormData();
        formData.append(fileFieldName, parameter);
        data = formData;
      } else if (typeInfo.isQuery) params = parameter;
      else if (typeInfo.isBody) data = parameter;
      else if (typeInfo.isSession || typeInfo.isReq || typeInfo.isRes) continue;
      else throw new Error("unknown typeInfo " + JSON.stringify(typeInfo));
    }

    const res = await this.axiosInstance.request({
      method: method.type,
      url: method.url,
      params,
      data,
      ...option,
    });
    return res.data;
  }
}

/* 当根据名字找不到对应控制器的数据时抛出 */
export class NotFoundControllerError extends Error {}

/* 当根据提供的方法名找不到控制器内对应的方法时抛出 */
export class NotFoundMethodError extends Error {}
