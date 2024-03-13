import axios from 'axios';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

/* eslint-env browser */

var browser = typeof self == 'object' ? self.FormData : window.FormData;

const FormData = /*@__PURE__*/getDefaultExportFromCjs(browser);

///<reference types="../types.d.ts"/>
function controllerKey(name) {
    return Symbol(name);
}
class ServerApiProvider {
    axiosInstance;
    providerMetadata;
    constructor(axiosInstance = axios, providerMetadata){
        this.axiosInstance = axiosInstance;
        this.providerMetadata = providerMetadata;
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
            if (!typeInfo) continue;
            const fileFieldName = typeInfo.isFiles || typeInfo.isFile;
            if (fileFieldName) {
                const formData = new FormData();
                formData.append(fileFieldName, parameter);
                data = formData;
            } else if (typeInfo.isQuery) params = parameter;
            else if (typeInfo.isBody) data = parameter;
            else if (typeInfo.isSession || typeInfo.isReq || typeInfo.isRes) continue;
            else {
                if (method.type === "GET") params = parameter;
                else data = parameters;
            }
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
