import { Metadata, Injectable, getDecoratedName, Container, LoadableContainer } from 'dependency-injection';
export * from 'dependency-injection';
import 'reflect-metadata';

class ServerError extends Error {
}
function composeUrl(...items) {
    return "/" + items.map(removeHeadTailSlash).filter((str)=>str.length > 0).join("/");
}
/* 删除头尾的斜线 */ function removeHeadTailSlash(str) {
    while(str[0] === "/")str = str.slice(1);
    while(str[str.length - 1] === "/")str = str.slice(0, str.length - 1);
    return str;
}
function getOrCreateMetadataUserData(obj) {
    const metadata = Metadata.getOrCreateMetadata(obj);
    const userData = metadata.userData;
    if (!userData.__server__) {
        userData.__server__ = true;
        userData.__server__isErrorHandler = false;
        userData.__server__isController = false;
        userData.__server__isPipeline = false;
        userData.__server__metadata = metadata;
        userData.__server__controllerRoutePrefix = "";
        userData.__server__controllerMethods = {};
        userData.__server__handle_error_type = ServerError;
    }
    return userData;
}
function getOrCreateControllerMethod(target, methodName) {
    const userData = getOrCreateMetadataUserData(target);
    let res = userData.__server__controllerMethods[methodName];
    if (!res) {
        res = {
            methodName,
            methodType: "GET",
            paramtypes: [],
            paramGetters: {},
            route: "",
            routePrefix: ""
        };
        /* parse findBuId to find-by-id */ for(let i = 0; i < methodName.length; i++){
            let char = methodName[i];
            if (/[A-Z]/.test(char)) {
                char = char.toLowerCase();
                if (i > 0) char = "-" + char;
            }
            res.route += char;
        }
        userData.__server__controllerMethods[methodName] = res;
    }
    return res;
}

/* 本库所使用的依赖注入模块名 */ const MODULE_NAME = "server";
/* Web服务器默认的监听端口 */ const DEFAULT_PORT = 4000;
/* Server对象在容器中的标识。写出来是为了防止在代码中直接引用Server对象，避免可能的依赖循环 */ const SERVER_LABEL = "Server";
const PARAMTYPES_REQUEST = "__server__request";
const PARAMTYPES_RESPONSE = "__server__response";
const PARAMTYPES_REQUEST_QUERY = "__server__request_query";
const PARAMTYPES_REQUEST_BODY = "__server__request_body";
const PARAMTYPES_SESSION = "__server__request_session";
const PARAMTYPES_FILE = "__server__request_file";
const PARAMTYPES_FILES = "__server__request_files";

var ControllerManager;
(function(ControllerManager) {
    const urlMapRouteHandler = new Map();
    function register(type, url, controllerClass, methodName) {
        let handler = urlMapRouteHandler.get(url);
        if (!handler) urlMapRouteHandler.set(url, handler = {});
        if (handler[type]) throw new DuplicateRouteHandlerError(`${type}:${url}的路由处理方法出现重复`);
        handler[type] = {
            controllerClass,
            methodName
        };
    }
    ControllerManager.register = register;
    function getRouteHandler(methodType, url) {
        const handler = urlMapRouteHandler.get(url)?.[methodType];
        if (!handler) throw new NotFoundRouteHandlerError();
        return handler;
    }
    ControllerManager.getRouteHandler = getRouteHandler;
    let DuplicateRouteHandlerError = class DuplicateRouteHandlerError extends ServerError {
    };
    ControllerManager.DuplicateRouteHandlerError = DuplicateRouteHandlerError;
    let NotFoundRouteHandlerError = class NotFoundRouteHandlerError extends ServerError {
    };
    ControllerManager.NotFoundRouteHandlerError = NotFoundRouteHandlerError;
})(ControllerManager || (ControllerManager = {}));

/* 本库封装的请求对象，抹除不同框架的请求对象的不同 */ class ServerRequest {
    /* Web框架的原请求对象 */ original;
    /* 读取session内容 */ session;
    /* 请求头 */ headers;
    /* 请求体内容 */ body;
    /* 上传的文件 */ files;
    /* Get request URL. */ url;
    /**
   * Get origin of URL.
   */ origin;
    /**
   * Get full request URL.
   */ href;
    /**
   * Get request method.
   */ method;
    /**
   * Get request pathname.
   */ path;
    /**
   * Get parsed query-string.
   */ query;
    /**
   * Get query string.
   */ querystring;
    /**
   * Get the search string. Same as the querystring
   * except it includes the leading ?.
   */ search;
    /**
   * Parse the "Host" header field host
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */ host;
    /**
   * Parse the "Host" header field hostname
   * and support X-Forwarded-Host when a
   * proxy is enabled.
   */ hostname;
    /**
   * Get WHATWG parsed URL object.
   */ URL;
}

function ErrorHandler(errorClass) {
    const injectable = Injectable({
        singleton: true,
        moduleName: MODULE_NAME
    });
    return (clazz, _)=>{
        injectable(clazz, _);
        const userData = getOrCreateMetadataUserData(clazz);
        userData.__server__isErrorHandler = true;
        userData.__server__handle_error_type = errorClass;
    };
}
function Controller(option) {
    const injectable = Injectable({
        createImmediately: true,
        singleton: true,
        moduleName: MODULE_NAME
    });
    return (clazz, _)=>{
        injectable(clazz, _);
        const userData = getOrCreateMetadataUserData(clazz);
        userData.__server__isController = true;
        userData.__server__controllerRoutePrefix = option?.routePrefix ?? "";
        for(let methodName in userData.__server__controllerMethods){
            const method = userData.__server__controllerMethods[methodName];
            ControllerManager.register(method.methodType, composeUrl(userData.__server__controllerRoutePrefix, method.routePrefix, method.route), clazz, methodName);
        }
    };
}
function Method(option) {
    return (target, methodName)=>{
        methodName = getDecoratedName(methodName);
        const ctrMethod = getOrCreateControllerMethod(target, methodName);
        if (option?.type) ctrMethod.methodType = option.type;
        if (option?.route) ctrMethod.route = option.route;
        if (option?.routePrefix) ctrMethod.routePrefix = option.routePrefix;
        if (option?.paramtypes) {
            for(let index in option.paramtypes){
                if (ctrMethod.paramtypes[index]) continue;
                ctrMethod.paramtypes[index] = option.paramtypes[index];
            }
        }
        const paramtypes = Reflect.getMetadata("design:paramtypes", target, methodName);
        if (paramtypes) {
            for(let i = 0; i < paramtypes.length; i++){
                if (ctrMethod.paramtypes[i]) continue;
                ctrMethod.paramtypes[i] = paramtypes[i].name;
            }
        }
    };
}
function ParamType(option) {
    return (target, methodName, index)=>{
        methodName = getDecoratedName(methodName);
        const ctrMethod = getOrCreateControllerMethod(target, methodName);
        ctrMethod.paramtypes[index] = option.label;
        if (option.getter) ctrMethod.paramGetters[index] = option.getter;
    };
}
function Req() {
    return ParamType({
        label: PARAMTYPES_REQUEST
    });
}
function Res() {
    return ParamType({
        label: PARAMTYPES_RESPONSE
    });
}
function ReqBody() {
    return ParamType({
        label: PARAMTYPES_REQUEST_BODY
    });
}
function ReqQuery() {
    return ParamType({
        label: PARAMTYPES_REQUEST_QUERY
    });
}
function ReqSession() {
    return ParamType({
        label: PARAMTYPES_SESSION
    });
}
function ReqFile(fieldName) {
    return ParamType({
        label: PARAMTYPES_FILE,
        getter: (container)=>{
            const request = container.getValue(ServerRequest);
            if (!request.files) throw new NotFoundFileError();
            const files = request.files[fieldName];
            if (!files) throw new NotFoundFileError();
            if (files instanceof Array) throw new ImproperDecoratorError();
            return files;
        }
    });
}
function ReqFiles(fieldName) {
    return ParamType({
        label: PARAMTYPES_FILES,
        getter: (container)=>{
            const request = container.getValue(ServerRequest);
            if (!request.files) throw new NotFoundFileError();
            const files = request.files[fieldName];
            if (!files) throw new NotFoundFileError();
            if (files instanceof Array) return files;
            throw new ImproperDecoratorError();
        }
    });
}
class NotFoundFileError extends Error {
}
class ImproperDecoratorError extends Error {
}
function Pipeline() {
    const injectable = Injectable({
        moduleName: MODULE_NAME
    });
    return (clazz, _)=>{
        injectable(clazz, _);
        const userData = getOrCreateMetadataUserData(clazz);
        userData.__server__isPipeline = true;
    };
}

function _ts_decorate$1(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
class ServerErrorHandler {
    handle(err, res) {
        res.statusCode = 500;
        res.body(err.message);
    }
}
ServerErrorHandler = _ts_decorate$1([
    ErrorHandler(ServerError)
], ServerErrorHandler);

/* 本库封装的响应对象，抹除不同框架的响应对象的不同 */ class ServerResponse {
    /* Web框架的原响应对象 */ original;
    /* 响应头 */ headers;
    /* 更新session内容 */ session;
    /* 状态码 */ statusCode;
    /* 发送响应体 */ body(value) {}
    /* 发送文件 */ sendFile(filePath) {
        return Promise.resolve();
    }
    /* 重定向 */ redirect(url) {}
}

class Session {
    req;
    res;
    constructor(req, res){
        this.req = req;
        this.res = res;
    }
    set(key, value) {
        if (!this.res.session) this.res.session = {};
        this.res.session[key] = value;
        return this;
    }
    get(key) {
        return this.req.session?.[key];
    }
    fetch(key) {
        if (!this.has(key)) throw new SessionKeyNotExistError();
        return this.req.session[key];
    }
    has(key) {
        if (!this.req.session) return false;
        return key in this.req.session;
    }
    destroy() {
        this.res.session = null;
    }
}
class SessionKeyNotExistError extends ServerError {
}

function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
class RequestPipeline {
    container;
    request;
    response;
    constructor(container, request, response){
        this.container = container;
        this.request = request;
        this.response = response;
        this.container.bindValue(ServerRequest.name, request).bindValue(ServerResponse.name, response).bindValue(PARAMTYPES_REQUEST, request).bindValue(PARAMTYPES_RESPONSE, response).bindValue(PARAMTYPES_REQUEST_QUERY, request.query).bindValue(PARAMTYPES_REQUEST_BODY, request.body).bindGetter(PARAMTYPES_SESSION, ()=>new Session(request, response)).bindGetter(Session.name, ()=>new Session(request, response));
    }
    start() {
        try {
            const server = this.container.getValue(SERVER_LABEL);
            const routeHandler = server.getRouteHandler(this.request.path);
            routeHandler.call(this.container);
        } catch (e) {}
    }
    dispose() {
        this.container.dispose();
    }
}
RequestPipeline = _ts_decorate([
    Pipeline(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Container === "undefined" ? Object : Container,
        typeof ServerRequest === "undefined" ? Object : ServerRequest,
        typeof ServerResponse === "undefined" ? Object : ServerResponse
    ])
], RequestPipeline);

/* 保存一个路由对应的Controller和方法。能够执行方法并返回结果 */ class RouteHandler {
    controller;
    methodName;
    constructor(controller, methodName){
        this.controller = controller;
        this.methodName = methodName;
    }
    /**
   * 执行方法
   * @param container 依赖注入容器
   */ call(container) {
        const controllerMethod = getOrCreateControllerMethod(this.controller.constructor, this.methodName);
        return container[this.methodName](...controllerMethod.paramtypes.map((type, index)=>controllerMethod.paramGetters[index]?.(container) ?? container.getValue(type)));
    }
}

class Server {
    _serverPlatform;
    /* 创建Server对象 */ static async create(serverPlatform) {
        const app = new Server(serverPlatform);
        await app._init();
        return app;
    }
    constructor(/* Web框架的适配器 */ _serverPlatform){
        this._serverPlatform = _serverPlatform;
        this._routeHandlerMap = new Map();
        this._dependencyInjection = new LoadableContainer();
    }
    /* 路由路径映射RouteHandler */ _routeHandlerMap;
    /* 依赖注入的容器 */ _dependencyInjection;
    /* Web框架的实例 */ _platformInstance;
    /* 返回Web框架的实例 */ get platformInstance() {
        return this._platformInstance;
    }
    /* 创建一个依赖注入容器，并且继承自Server内部保有的根容器 */ createContainer() {
        return new Container().extend(this._dependencyInjection);
    }
    /* 启动服务器 */ async bootstrap(option = {}) {
        if (!option.port) option.port = DEFAULT_PORT;
        this._serverPlatform.bootstrap(option);
    }
    /**
   * 根据请求的path获取对应的路由处理对象
   * @throws NotFountRouteHandlerError 找不到路由处理对象时抛出
   */ getRouteHandler(path) {
        const routeHandler = this._routeHandlerMap.get(path);
        if (!routeHandler) throw new NotFountRouteHandlerError(`找不到path ${path} 对应的RouteHandler对象`);
        return routeHandler;
    }
    /* 初始化Web服务器 */ async _init() {
        this._dependencyInjection.bindValue(SERVER_LABEL, this).bindFactory(Container.name, this.createContainer.bind(this));
        this._platformInstance = await this._serverPlatform.create();
        this._dependencyInjection.load({
            moduleName: MODULE_NAME
        });
        const controllerMetadataArray = Array.from(Metadata.getAllMetadata()).filter((item)=>getOrCreateMetadataUserData(item.clazz).__server__isController);
        for (let metadata of controllerMetadataArray){
            const userData = getOrCreateMetadataUserData(metadata.clazz);
            for(let methodName in userData.__server__controllerMethods){
                const controllerMethod = userData.__server__controllerMethods[methodName];
                const path = "/" + [
                    removeHeadTailSlash(userData.__server__controllerRoutePrefix),
                    removeHeadTailSlash(controllerMethod.routePrefix),
                    removeHeadTailSlash(controllerMethod.route)
                ].filter((item)=>!!item).join("/");
                this._routeHandlerMap.set(path, new RouteHandler(this._dependencyInjection.getValue(metadata.clazz), controllerMethod.methodName));
            }
        }
    }
}
/* 当根据请求的path找不到RouteHandler对象时抛出 */ class NotFountRouteHandlerError extends ServerError {
}

export { Controller, DEFAULT_PORT, ErrorHandler, ImproperDecoratorError, MODULE_NAME, Method, NotFoundFileError, NotFountRouteHandlerError, PARAMTYPES_FILE, PARAMTYPES_FILES, PARAMTYPES_REQUEST, PARAMTYPES_REQUEST_BODY, PARAMTYPES_REQUEST_QUERY, PARAMTYPES_RESPONSE, PARAMTYPES_SESSION, ParamType, Pipeline, Req, ReqBody, ReqFile, ReqFiles, ReqQuery, ReqSession, RequestPipeline, Res, RouteHandler, SERVER_LABEL, Server, ServerError, ServerErrorHandler, ServerRequest, ServerResponse, Session, SessionKeyNotExistError, composeUrl, getOrCreateControllerMethod, getOrCreateMetadataUserData, removeHeadTailSlash };
