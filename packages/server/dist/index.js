import { validate as validate$1 } from 'class-validator';
export * from 'class-validator';
import { Metadata, Injectable, Inject, getDecoratedName, NotExistLabelError, LoadableContainer, Container } from 'dependency-injection';
export * from 'dependency-injection';
import chalk from 'chalk';
import * as process from 'node:process';

/* server自定义错误的根类型 */ class ServerError extends Error {
    code = 500;
    name = "ServerError";
}
/* 当请求不具备权限时抛出 */ class UnauthorizedError extends ServerError {
    code = 401;
    name = "UnauthorizedError";
}
/* 当找不到数据时抛出 */ class NotFoundError extends ServerError {
    code = 404;
    name = "NotFoundError";
}
/* 当出现路由重复时抛出 */ class DuplicateRouteHandlerError extends ServerError {
    name = "DuplicateRouteHandlerError";
}
/* 当找不到路由对应的控制器方法时抛出 */ class NotFoundRouteHandlerError extends ServerError {
    code = 404;
    name = "NotFoundRouteHandlerError";
}
/* 当在ServerRequest对象中找不到指定字段的文件时抛出 */ class NotFoundFileError extends ServerError {
    name = "NotFoundFileError";
}
/* 当不恰当的使用装饰器时抛出 */ class ImproperDecoratorError extends ServerError {
    name = "ImproperDecoratorError";
}
/* 当在session上找不到key时抛出 */ class SessionKeyNotExistError extends ServerError {
    name = "SessionKeyNotExistError";
}
/* 当根据类型名找不到对应的验证器时抛出 */ class NotFoundValidatorError extends ServerError {
    name = "NotFoundValidatorError";
}
/* 当数据验证失败时抛出 */ class ValidateFailedError extends ServerError {
    name = "ValidateFailedError";
}

/* 组装url */ function composeUrl(...items) {
    return "/" + items.map(removeHeadTailSlash).filter((str)=>str.length > 0).join("/");
}
/* 删除头尾的斜线 */ function removeHeadTailSlash(str) {
    while(str[0] === "/")str = str.slice(1);
    while(str[str.length - 1] === "/")str = str.slice(0, str.length - 1);
    return str;
}
/* 得到或新建专给server库使用的userData */ function getOrCreateMetadataUserData(obj) {
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
/* 得到或新建控制器方法信息对象 */ function getOrCreateControllerMethod(target, methodName) {
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
/* 环境名在依赖注入容器中的标签名，用于日志输出 */ const CONTEXT_LABEL = "ContextName";
/* 鉴权白名单 */ const WHITE_LIST = "WhiteList";

var RouteManager;
(function(RouteManager) {
    const urlMapRouteHandlerSet = new Map();
    function getUrls() {
        return urlMapRouteHandlerSet.keys();
    }
    /* 获取所有路由url */ RouteManager.getUrls = getUrls;
    function getMethodTypes(url) {
        const set = new Set();
        const routeHandlerSet = urlMapRouteHandlerSet.get(url);
        if (!routeHandlerSet) throw new NotFoundRouteHandlerError(`${url} Not Found route handler`);
        Object.keys(routeHandlerSet).forEach((methodType)=>set.add(methodType));
        return set;
    }
    /**
   * 获取url对应的请求类型
   * @throws NotFoundRouteHandlerError 当找不到url对应的RouteHandler时抛出
   */ RouteManager.getMethodTypes = getMethodTypes;
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
   * @throws DuplicateRouteHandlerError 当路由出现重复时抛出
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

/* 标识该类为路由守卫 */ function Guard() {
    const injectable = Injectable({
        singleton: true,
        moduleName: MODULE_NAME
    });
    return (clazz, _)=>{
        injectable(clazz, _);
        const userData = getOrCreateMetadataUserData(clazz);
        userData.__server__classType = "guard";
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

/* 标识该类用来处理值的转换 */ function Parser() {
    const injectable = Injectable({
        singleton: true,
        moduleName: MODULE_NAME
    });
    return (clazz, _)=>{
        injectable(clazz, _);
        const userData = getOrCreateMetadataUserData(clazz);
        userData.__server__classType = "parser";
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

function _ts_decorate$4(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
class RegularParser {
    parse(value) {
        if (typeof value === "string") return parseString(value);
        if (typeof value === "object" && value) {
            for(let prop in value){
                const val = value[prop];
                value[prop] = this.parse(val);
            }
        }
        return value;
        function parseString(value) {
            if (value === "true") return true;
            else if (value === "false") return false;
            if (value.length === 0) return "";
            const number = Number(value);
            if (!Number.isNaN(number)) return number;
            const date = new Date(value);
            if (date.toString() !== "Invalid Date") return date;
            return value;
        }
    }
}
RegularParser = _ts_decorate$4([
    Parser()
], RegularParser);

const parsedKey = Symbol("parsed");
const validatedKey = Symbol("validated");
/* 对输入进行转化和校验 */ function ParserAndValidate(option) {
    let targetObject, targetMethodName = "", targetIndex = 0;
    const inject = Inject({
        typeValueGetter: (container)=>{
            const prevValue = option.typeValueGetter(container);
            let value;
            if (typeof prevValue === "object") {
                if (!prevValue[parsedKey]) {
                    value = parse(container, option.parsers, prevValue);
                    prevValue[parsedKey] = true;
                }
            } else {
                value = parse(container, option.parsers, prevValue);
            }
            if (option.validator === false || typeof value !== "object") return value;
            if (!value[validatedKey]) {
                value[validatedKey] = true;
                validate(container, targetObject, targetMethodName, targetIndex, value);
            }
            return value;
        }
    });
    return (target, methodName, index)=>{
        inject(target, methodName, index);
        targetObject = target;
        targetMethodName = getDecoratedName(methodName);
        targetIndex = index;
    };
}
/**
 * 验证指定的数据
 * @throws NotFoundValidatorError 当找不到类型对应的验证器时抛出
 * @throws ValidateFailedError 当数据验证失败时抛出
 */ function validate(container, target, methodName, argIndex, value) {
    const metadata = Metadata.getOrCreateMetadata(target);
    const parameterTypes = metadata.getMethodParameterTypes(methodName);
    const type = parameterTypes.types[argIndex];
    if (type === "String" || type === "Boolean" || type === "Number" || type === "Object" || type === "Function" || type === "Symbol") return;
    const errorProps = [];
    try {
        const instance = container.getValue(type);
        if (typeof instance === "object") errorProps.push(...validate$1(Object.assign(instance, value)));
    } catch (e) {
        if (e instanceof NotExistLabelError) throw new NotFoundValidatorError(`找不到类型${type}对应的验证器`);
        throw e;
    }
    if (errorProps.length) throw new ValidateFailedError(errorProps.map((propName)=>`${type}.${propName}校验失败。`).join("\n"));
}
/* 将输入的值进行转化 */ function parse(container, parsers, value) {
    if (!parsers && parsers === undefined) parsers = [
        RegularParser
    ];
    if (parsers && !(parsers instanceof Array)) parsers = [
        parsers
    ];
    if (!parsers) return value;
    return parsers.reduce((value, parserClass)=>container.getValue(parserClass).parse(value), value);
}

/* 属性/参数装饰器。为被装饰者注入请求体 */ function ReqBody(option) {
    return ParserAndValidate({
        ...option,
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

/* 属性/参数装饰器。为被装饰者注入请求参数 */ function ReqQuery(option) {
    return ParserAndValidate({
        ...option,
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

/* 标识类用来处理需要返回的内容 */ function ResponseBodySender() {
    const injectable = Injectable({
        singleton: true,
        moduleName: MODULE_NAME
    });
    return (clazz, _)=>{
        injectable(clazz, _);
        const userData = getOrCreateMetadataUserData(clazz);
        userData.__server__classType = "response-body-sender";
    };
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
        /* 在express-session中，id似乎是只读的，不能修改。干脆直接把对id的修改给禁了 */ if (key === "id") throw new ServerError("Session.id是只读属性不能修改");
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

function _ts_decorate$3(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$2(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
class AuthorizedGuard {
    guard(session, whiteList, req) {
        if (whiteList.length === 0 || whiteList.includes("*")) return;
        if (whiteList.includes(req.path)) return;
        if (!session.get("userId")) throw new UnauthorizedError("未登录或登陆信息已过期");
    }
}
_ts_decorate$3([
    Inject(),
    _ts_param(0, ReqSession()),
    _ts_param(1, Inject({
        typeLabel: WHITE_LIST
    })),
    _ts_metadata$2("design:type", Function),
    _ts_metadata$2("design:paramtypes", [
        typeof Session === "undefined" ? Object : Session,
        Array,
        typeof ServerRequest === "undefined" ? Object : ServerRequest
    ]),
    _ts_metadata$2("design:returntype", Object)
], AuthorizedGuard.prototype, "guard", null);
AuthorizedGuard = _ts_decorate$3([
    Guard()
], AuthorizedGuard);

function _ts_decorate$2(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata$1(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    day: "2-digit",
    month: "2-digit"
});
class ConsoleLogger {
    contextName;
    constructor(contextName){
        this.contextName = contextName;
        this.logLevelColorMap = {
            debug: chalk.magentaBright,
            warn: chalk.yellow,
            error: chalk.red,
            verbose: chalk.cyanBright,
            fatal: chalk.bold,
            log: chalk.green
        };
    }
    /* 日志颜色表 */ logLevelColorMap;
    log(level, message) {
        const colorize = this.logLevelColorMap[level] ?? this.logLevelColorMap.log;
        if (message instanceof Error) message = colorize(message);
        const output = `[${this.contextName}] ${colorize(process.pid)} - ${dateTimeFormatter.format(Date.now())} ${colorize(level.toUpperCase())} ${message}\n`;
        process.stdout.write(output);
    }
}
ConsoleLogger = _ts_decorate$2([
    Injectable({
        moduleName: MODULE_NAME,
        singleton: true,
        paramtypes: [
            CONTEXT_LABEL
        ]
    }),
    _ts_metadata$1("design:type", Function),
    _ts_metadata$1("design:paramtypes", [
        String
    ])
], ConsoleLogger);

function _ts_decorate$1(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
/* 将要返回的响应体内容 */ class ResponseBody {
    object;
    success;
    code;
    msg;
    /* 从Error对象生成响应体内容 */ static fromError(error) {
        return new ResponseBody({}, false, error.code ?? 500, error.message);
    }
    /* 从值生成响应体内容 */ static from(value) {
        if (value instanceof Error) return this.fromError(value);
        else if (value instanceof ResponseBody) return value;
        return new ResponseBody(value);
    }
    static fromFilePath(filePath) {
        return this.from({
            filePath,
            __isFilePath__: true
        });
    }
    constructor(object, success = true, code = 200, msg = "ok"){
        this.object = object;
        this.success = success;
        this.code = code;
        this.msg = msg;
    }
}
class RegularResponseBodySender {
    send(value, res) {
        const responseBody = ResponseBody.from(value);
        res.statusCode = responseBody.code;
        if (responseBody.object?.__isFilePath__) return res.sendFile(responseBody.object.filePath);
        else res.body(responseBody);
    }
}
RegularResponseBodySender = _ts_decorate$1([
    ResponseBodySender()
], RegularResponseBodySender);

class Server {
    _serverPlatform;
    /* 创建Server对象 */ static async create(options) {
        const app = new Server(options.serverPlatformAdapter);
        await app._init(options);
        return app;
    }
    constructor(/* Web框架的适配器 */ _serverPlatform){
        this._serverPlatform = _serverPlatform;
        this._dependencyInjection = new LoadableContainer();
        this._loggerClasses = [];
        this._guardClasses = [];
    }
    /* 依赖注入的容器 */ _dependencyInjection;
    get dependencyInjection() {
        return this._dependencyInjection;
    }
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
    /* 用来处理日志的Logger类集合 */ _loggerClasses;
    /* 路由守卫类的集合 */ _guardClasses;
    get guardClasses() {
        return this._guardClasses;
    }
    /* 输出日志 */ log(logLevel, message) {
        for (let loggerClass of this._loggerClasses){
            const logger = this._dependencyInjection.getValue(loggerClass);
            logger.log(logLevel, message);
        }
    }
    /* 创建一个依赖注入容器，并且继承自Server内部保有的根容器 */ createContainer() {
        return new LoadableContainer().extend(this._dependencyInjection);
    }
    /* 启动服务器 */ bootstrap(option = {}) {
        if (!option.port) option.port = DEFAULT_PORT;
        this._serverPlatform.bootstrap(option);
        this.log("log", `启动成功，监听端口${option.port}`);
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
    /* 处理请求 */ async handleRequest(request, response) {
        this.log("log", `[${request.method}] ${request.url}`);
        const container = this.createContainer().extend(this._dependencyInjection);
        container.bindValue(ServerRequest.name, request).bindValue(ServerResponse.name, response);
        const pipeline = container.getValue(this._requestPipelineClass);
        await pipeline.start();
        pipeline.dispose();
        container.dispose();
    }
    /* 初始化Web服务器 */ async _init(options) {
        this._errorHandlerDispatcher = new ErrorHandlerDispatcher(options.errorHandlers ?? []);
        this._requestPipelineClass = options.pipeline ?? RequestPipeline;
        this._dependencyInjection.bindValue(Server.name, this).bindFactory(Container.name, this.createContainer.bind(this)).bindValue(CONTEXT_LABEL, (options.contextName || "server") + ":" + this._serverPlatform.name);
        this._dependencyInjection.load({
            moduleName: MODULE_NAME
        });
        this._responseBodySender = this._dependencyInjection.getValue(options.responseBodySender ?? RegularResponseBodySender);
        if (options.consoleLogger !== false) this._loggerClasses.push(ConsoleLogger);
        if (options.loggers) {
            this._loggerClasses.push(...options.loggers);
        }
        if (options.guards) this._guardClasses.push(...options.guards);
        this._setupRoutes();
        this._platformInstance = await this._serverPlatform.create();
    }
    /* 给Web框架设置路由 */ _setupRoutes() {
        const urls = RouteManager.getUrls();
        const routes = {};
        for (let url of urls){
            routes[url] = {
                handle: this.handleRequest.bind(this),
                catchError: this._catchRequestError.bind(this),
                methodTypes: RouteManager.getMethodTypes(url)
            };
        }
        this._serverPlatform.useRoutes(routes);
    }
    /* 处理请求中的错误 */ _catchRequestError(err, _, response) {
        this.log("error", err);
        return this._responseBodySender.send(err, response);
    }
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
    server;
    request;
    response;
    constructor(server, request, response){
        this.server = server;
        this.request = request;
        this.response = response;
        this._container = server.createContainer();
        this._container.bindValue(Container.name, this._container).bindValue(ServerRequest.name, request).bindValue(ServerResponse.name, response).bindGetter(Session.name, ()=>new Session(request, response));
    }
    /* 依赖注入容器 */ _container;
    /* 启动管道，开始处理请求 */ async start() {
        const responseBodySender = this.server.responseBodySender;
        let result;
        try {
            for (let guardClass of this.server.guardClasses){
                const guard = this._container.getValue(guardClass);
                await this._container.call(guard, "guard");
            }
            const routeHandler = RouteManager.getRouteHandler(this.request.method, this.request.path);
            result = await this._container.call(this._container.getValue(routeHandler.controllerClass), routeHandler.methodName);
        } catch (e) {
            this.server.log("error", e);
            result = e;
            const errorHandlerClass = this.server.errorHandlerDispatcher.dispatch(e);
            if (errorHandlerClass) {
                const errorHandler = this._container.getValue(errorHandlerClass);
                result = await errorHandler.handle(e, this.response, this.request);
            }
        }
        return responseBodySender.send(result, this.response);
    }
    /* 销毁管道 */ dispose() {
        this._container.dispose();
    }
}
RequestPipeline = _ts_decorate([
    Pipeline(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Server === "undefined" ? Object : Server,
        typeof ServerRequest === "undefined" ? Object : ServerRequest,
        typeof ServerResponse === "undefined" ? Object : ServerResponse
    ])
], RequestPipeline);

export { AuthorizedGuard, CONTEXT_LABEL, ConsoleLogger, Controller, DEFAULT_PORT, DuplicateRouteHandlerError, ErrorHandler, ErrorHandlerDispatcher, Guard, ImproperDecoratorError, MODULE_NAME, Method, NotFoundError, NotFoundFileError, NotFoundRouteHandlerError, NotFoundValidatorError, Parser, Pipeline, RegularParser, RegularResponseBodySender, Req, ReqBody, ReqFile, ReqFiles, ReqQuery, ReqSession, RequestPipeline, Res, ResponseBody, ResponseBodySender, RouteManager, Server, ServerError, ServerRequest, ServerResponse, Session, SessionKeyNotExistError, UnauthorizedError, ValidateFailedError, WHITE_LIST, composeUrl, getOrCreateControllerMethod, getOrCreateMetadataUserData, removeHeadTailSlash };
