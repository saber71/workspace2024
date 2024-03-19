import axios from 'axios';

///<reference types="../types.d.ts"/>
function controllerKey(name) {
    return Symbol(name);
}
class ServerApiProvider {
    providerMetadata;
    axiosInstance;
    constructor(providerMetadata, axiosInstance = axios){
        this.providerMetadata = providerMetadata;
        this.axiosInstance = axiosInstance;
    }
    async request(key, methodName, parameters, option) {
        const methodSet = this.providerMetadata[key.description];
        if (!methodSet) throw new NotFoundControllerError(`找不到名为${key.description}的控制器数据`);
        const method = methodSet[methodName];
        if (!method) throw new NotFoundMethodError(`在控制器内找不到名为${methodName}的方法数据`);
        let params;
        let data;
        for(let i = 0; i < parameters.length; i++){
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
            ...option
        });
        return res.data;
    }
}
/* 当根据名字找不到对应控制器的数据时抛出 */ class NotFoundControllerError extends Error {
}
/* 当根据提供的方法名找不到控制器内对应的方法时抛出 */ class NotFoundMethodError extends Error {
}

export { NotFoundControllerError, NotFoundMethodError, ServerApiProvider, controllerKey };
