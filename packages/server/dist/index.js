import { Metadata, Injectable, Inject, getDecoratedName, Container, LoadableContainer } from 'dependency-injection';
export * from 'dependency-injection';

/* server自定义错误的根类型 */ class ServerError extends Error {
    code = 500;
}
/* 当出现路由重复时抛出 */ class DuplicateRouteHandlerError extends ServerError {
}
/* 当找不到路由对应的控制器方法时抛出 */ class NotFoundRouteHandlerError extends ServerError {
    code = 404;
}
/* 当在ServerRequest对象中找不到指定字段的文件时抛出 */ class NotFoundFileError extends ServerError {
}
/* 当不恰当的使用装饰器时抛出 */ class ImproperDecoratorError extends ServerError {
}
/* 当在session上找不到key时抛出 */ class SessionKeyNotExistError extends ServerError {
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
        userData.__server__classType = "no-special";
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
            type: "GET",
            route: "",
            routePrefix: ""
        };
        /* parse findById to find-by-id */ for(let i = 0; i < methodName.length; i++){
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

var RouteManager;
(function(RouteManager) {
    const urlMapRouteHandlerSet = new Map();
    function getUrls() {
        return urlMapRouteHandlerSet.keys();
    }
    /* 获取所有路由url */ RouteManager.getUrls = getUrls;
    function register(type, url, controllerClass, methodName) {
        let handler = urlMapRouteHandlerSet.get(url);
        if (!handler) urlMapRouteHandlerSet.set(url, handler = {});
        if (handler[type]) throw new DuplicateRouteHandlerError(`${type}:${url}的路由处理方法出现重复`);
        handler[type] = {
            controllerClass,
            methodName
        };
    }
    /**
   * 保存路由url及其控制器方法
   * @throws DuplicateRouteHandlerError 当出现路由重复时抛出
   */ RouteManager.register = register;
    function getRouteHandler(methodType, url) {
        const handler = urlMapRouteHandlerSet.get(url)?.[methodType];
        if (!handler) throw new NotFoundRouteHandlerError(`${methodType}:${url} Not Found route handler`);
        return handler;
    }
    /**
   * 查找路由url对应的控制器方法
   * @throws NotFoundRouteHandlerError 当找不到路由对应的控制器方法时抛出
   */ RouteManager.getRouteHandler = getRouteHandler;
})(RouteManager || (RouteManager = {}));

/* 类装饰器。标识类的实例为控制器，单例，系统初始化时创建 */ function Controller(option) {
    const injectable = Injectable({
        createImmediately: true,
        singleton: true,
        moduleName: MODULE_NAME,
        paramtypes: option?.paramtypes,
        paramGetters: option?.paramGetters
    });
    return (clazz, _)=>{
        injectable(clazz, _);
        const userData = getOrCreateMetadataUserData(clazz);
        userData.__server__classType = "controller";
        userData.__server__controllerRoutePrefix = option?.routePrefix ?? "";
        for(let methodName in userData.__server__controllerMethods){
            const method = userData.__server__controllerMethods[methodName];
            RouteManager.register(method.type, composeUrl(userData.__server__controllerRoutePrefix, method.routePrefix, method.route), clazz, methodName);
        }
    };
}

/* 类装饰器。标识类的实例是错误处理器。单例。 */ function ErrorHandler(errorClass) {
    const injectable = Injectable({
        singleton: true,
        moduleName: MODULE_NAME
    });
    return (clazz, _)=>{
        injectable(clazz, _);
        const userData = getOrCreateMetadataUserData(clazz);
        userData.__server__classType = "error-handler";
        userData.__server__handle_error_type = errorClass;
    };
}

/* 方法装饰器。标识此方法用来处理路由。只有在类上装饰了Controller装饰器时才会生效 */ function Method(option) {
    const inject = Inject({
        paramtypes: option?.paramtypes,
        paramGetters: option?.paramGetters
    });
    return (target, methodName)=>{
        methodName = getDecoratedName(methodName);
        inject(target, methodName);
        const ctrMethod = getOrCreateControllerMethod(target, methodName);
        if (option?.type) ctrMethod.type = option.type;
        if (option?.route) ctrMethod.route = option.route;
        if (option?.routePrefix) ctrMethod.routePrefix = option.routePrefix;
    };
}

/* 类装饰器。标识此类的实例为管道。 */ function Pipeline() {
    const injectable = Injectable({
        moduleName: MODULE_NAME
    });
    return (clazz, _)=>{
        injectable(clazz, _);
        const userData = getOrCreateMetadataUserData(clazz);
        userData.__server__classType = "pipeline";
    };
}

/* 本库封装的请求对象，抹除不同框架的请求对象的不同 */ class ServerRequest {
    /* Web框架的原请求对象 */ original;
    /* 读取session内容 */ session;
    /* 请求头 */ headers;
    /* 请求体内容 */ body;
    /* 上传的文件 */ files;
    /* Get request URL. */ url;
    /* Get origin of URL. */ origin;
    /* Get full request URL. */ href;
    /* Get request method. */ method;
    /* Get request pathname. */ path;
    /* Get parsed query-string. */ query;
    /* Get query string. */ querystring;
    /* Get the search string. Same as the querystring except it includes the leading ?. */ search;
    /* Parse the "Host" header field host and support X-Forwarded-Host when a proxy is enabled. */ host;
    /* Parse the "Host" header field hostname and support X-Forwarded-Host when a proxy is enabled. */ hostname;
    /* Get WHATWG parsed URL object. */ URL;
}

/* 属性/参数装饰器。为被装饰者注入ServerRequest实例 */ function Req() {
    return Inject({
        typeValueGetter: (container)=>container.getValue(ServerRequest)
    });
}

/* 属性/参数装饰器。为被装饰者注入请求体 */ function ReqBody() {
    return Inject({
        typeValueGetter: (container)=>container.getValue(ServerRequest).body
    });
}

/* 属性/参数装饰器。为被装饰者注入指定字段的上传的单个文件对象 */ function ReqFile(fieldName) {
    return Inject({
        typeValueGetter: (container)=>{
            const request = container.getValue(ServerRequest);
            if (!request.files) throw new NotFoundFileError();
            const files = request.files[fieldName];
            if (!files) throw new NotFoundFileError(`字段${fieldName}的文件不存在`);
            if (files instanceof Array) throw new ImproperDecoratorError("指定字段的文件不止一个，请使用ReqFiles装饰器");
            return files;
        }
    });
}

/* 属性/参数装饰器。为被装饰者注入指定字段的上传的多个文件对象 */ function ReqFiles(fieldName) {
    return Inject({
        typeValueGetter: (container)=>{
            const request = container.getValue(ServerRequest);
            if (!request.files) throw new NotFoundFileError();
            const files = request.files[fieldName];
            if (!files) throw new NotFoundFileError(`字段${fieldName}的文件不存在`);
            if (files instanceof Array) return files;
            throw new ImproperDecoratorError("指定字段的文件只有一个，请使用ReqFile装饰器");
        }
    });
}

/* 属性/参数装饰器。为被装饰者注入请求参数 */ function ReqQuery() {
    return Inject({
        typeValueGetter: (container)=>container.getValue(ServerRequest).query
    });
}

/* 属性/参数装饰器。为被装饰者注入session对象 */ function ReqSession() {
    return Inject({
        typeValueGetter: (container)=>container.getValue(ServerRequest).session
    });
}

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

/* 属性/参数装饰器。为被装饰者注入ServerResponse实例 */ function Res() {
    return Inject({
        typeValueGetter: (container)=>container.getValue(ServerResponse)
    });
}

/* 错误处理器派发器，匹配Error对应的错误处理器 */ class ErrorHandlerDispatcher {
    _errorHandlerClasses = new Array();
    constructor(customErrorHandlers){
        this._errorHandlerClasses.push(...customErrorHandlers);
        this._checkErrorHandlers();
    }
    /* 匹配Error对应的错误处理器 */ dispatch(error) {
        for (let errorHandlerClass of this._errorHandlerClasses){
            const userData = getOrCreateMetadataUserData(errorHandlerClass);
            if (error instanceof userData.__server__handle_error_type) return errorHandlerClass;
        }
    }
    /* 检查现有的类是否都装饰ErrorHandler */ _checkErrorHandlers() {
        for (let errorHandlerClass of this._errorHandlerClasses){
            const userData = getOrCreateMetadataUserData(errorHandlerClass);
            if (userData.__server__classType !== "error-handler") throw new ServerError(errorHandlerClass.name + "未装饰ErrorHandler");
        }
    }
}

/* 读取/更新会话对象 */ class Session {
    req;
    res;
    constructor(req, res){
        this.req = req;
        this.res = res;
    }
    /* 更新会话对象 */ set(key, value) {
        if (!this.res.session) this.res.session = {};
        this.res.session[key] = value;
        return this;
    }
    /* 读取会话对象 */ get(key) {
        return this.req.session?.[key];
    }
    /**
   * 读取会话对象
   * @throws SessionKeyNotExistError 当在session上找不到key时抛出
   */ fetch(key) {
        if (!this.has(key)) throw new SessionKeyNotExistError(`在session上找不到key ` + key);
        return this.req.session[key];
    }
    /* 判断会话上是否存在指定的key */ has(key) {
        if (!this.req.session) return false;
        return key in this.req.session;
    }
    /* 删除会话对象 */ destroy() {
        this.res.session = null;
    }
}

function _ts_decorate$1(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
class RequestPipeline {
    server;
    request;
    response;
    constructor(server, request, response){
        this.server = server;
        this.request = request;
        this.response = response;
        this._container = server.createContainer().bindValue(Container.name, this._container).bindValue(ServerRequest.name, request).bindValue(ServerResponse.name, response).bindGetter(Session.name, ()=>new Session(request, response));
    }
    /* 依赖注入容器 */ _container;
    /* 启动管道，开始处理请求 */ async start() {
        const responseBodySender = this.server.responseBodySender;
        let result;
        try {
            const routeHandler = RouteManager.getRouteHandler(this.request.method, this.request.path);
            result = await this._container.call(this._container.getValue(routeHandler.controllerClass), routeHandler.methodName);
        } catch (e) {
            result = e;
            const errorHandlerClass = this.server.errorHandlerDispatcher.dispatch(e);
            if (errorHandlerClass) {
                const errorHandler = this._container.getValue(errorHandlerClass);
                result = await errorHandler.handle(e, this.response, this.request);
            }
        }
        responseBodySender.send(result, this.response);
    }
    /* 销毁管道 */ dispose() {
        this._container.dispose();
    }
}
RequestPipeline = _ts_decorate$1([
    Pipeline(),
    _ts_param(0, Inject({
        typeLabel: SERVER_LABEL
    })),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Server === "undefined" ? Object : Server,
        typeof ServerRequest === "undefined" ? Object : ServerRequest,
        typeof ServerResponse === "undefined" ? Object : ServerResponse
    ])
], RequestPipeline);

function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
class ResponseBodySender {
    send(value, res) {
        let success = true, code = 200, msg = "ok";
        if (value instanceof Error) {
            success = false;
            code = value.code ?? 500;
            msg = value.message;
        }
        res.statusCode = code;
        res.body({
            code,
            success,
            msg,
            object: value
        });
    }
}
ResponseBodySender = _ts_decorate([
    Injectable()
], ResponseBodySender);

let Server$1 = class Server {
    _serverPlatform;
    /* 创建Server对象 */ static async create(options) {
        const app = new Server(options.serverPlatformAdapter);
        await app._init(options);
        return app;
    }
    constructor(/* Web框架的适配器 */ _serverPlatform){
        this._serverPlatform = _serverPlatform;
        this._dependencyInjection = new LoadableContainer();
    }
    /* 依赖注入的容器 */ _dependencyInjection;
    /* 用来处理请求的管道类 */ _requestPipelineClass;
    /* Web框架的实例 */ _platformInstance;
    get platformInstance() {
        return this._platformInstance;
    }
    /* 错误处理器派发器，匹配Error对应的错误处理器 */ _errorHandlerDispatcher;
    get errorHandlerDispatcher() {
        return this._errorHandlerDispatcher;
    }
    /* 响应体body构建者的Class */ _responseBodySender;
    get responseBodySender() {
        return this._responseBodySender;
    }
    /* 创建一个依赖注入容器，并且继承自Server内部保有的根容器 */ createContainer() {
        return new Container().extend(this._dependencyInjection);
    }
    /* 启动服务器 */ bootstrap(option = {}) {
        if (!option.port) option.port = DEFAULT_PORT;
        this._serverPlatform.bootstrap(option);
    }
    /**
   * 支持静态资源
   * @param assetsPath 静态资源的文件夹路径
   * @param routePathPrefix 访问静态资源的路由前缀
   */ staticAssets(assetsPath, routePathPrefix) {
        this._serverPlatform.staticAssets(assetsPath, routePathPrefix);
        return this;
    }
    /* 配置代理转发 */ proxy(option) {
        this._serverPlatform.proxy(option);
        return this;
    }
    /* 初始化Web服务器 */ async _init(options) {
        this._errorHandlerDispatcher = new ErrorHandlerDispatcher(options.errorHandlers ?? []);
        this._requestPipelineClass = options.pipeline ?? RequestPipeline;
        this._dependencyInjection.bindValue(SERVER_LABEL, this).bindFactory(Container.name, this.createContainer.bind(this));
        this._dependencyInjection.load({
            moduleName: MODULE_NAME
        });
        this._responseBodySender = this._dependencyInjection.getValue(options.responseBodySender ?? ResponseBodySender);
        this._setupRoutes();
        this._platformInstance = await this._serverPlatform.create();
    }
    /* 给Web框架设置路由 */ _setupRoutes() {
        const urls = RouteManager.getUrls();
        const routes = {};
        for (let url of urls){
            routes[url] = {
                handle: this._handleRequest.bind(this),
                catchError: this._catchRequestError.bind(this)
            };
        }
        this._serverPlatform.useRoutes(routes);
    }
    /* 处理请求 */ async _handleRequest(request, response) {
        const container = this.createContainer().extend(this._dependencyInjection);
        container.bindValue(ServerRequest.name, request).bindValue(ServerResponse.name, response);
        const pipeline = container.getValue(this._requestPipelineClass);
        await pipeline.start();
        pipeline.dispose();
        container.dispose();
    }
    /* 处理请求中的错误 */ _catchRequestError(err, _, response) {
        this._responseBodySender.send(err, response);
    }
};

export { Controller, DEFAULT_PORT, DuplicateRouteHandlerError, ErrorHandler, ErrorHandlerDispatcher, ImproperDecoratorError, MODULE_NAME, Method, NotFoundFileError, NotFoundRouteHandlerError, Pipeline, Req, ReqBody, ReqFile, ReqFiles, ReqQuery, ReqSession, RequestPipeline, Res, ResponseBodySender, RouteManager, SERVER_LABEL, Server$1 as Server, ServerError, ServerRequest, ServerResponse, Session, SessionKeyNotExistError, composeUrl, getOrCreateControllerMethod, getOrCreateMetadataUserData, removeHeadTailSlash };
