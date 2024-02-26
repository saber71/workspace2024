var o = Object.defineProperty;
var v = (r, e, t) => e in r ? o(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var l = (r, e) => o(r, "name", { value: e, configurable: !0 });
var s = (r, e, t) => (v(r, typeof e != "symbol" ? e + "" : e, t), t);
import { Container as g, Metadata as p, Injectable as T, getDecoratedName as m } from "dependency-injection";
export * from "dependency-injection";
import "reflect-metadata";
const h = "server", b = 4e3, R = "__server__request", A = "__server__response", x = "__server__request_query", C = "__server__request_body", c = class c {
  constructor(e) {
    /* 依赖注入的容器 */
    s(this, "_dependencyInjection", new g());
    /* Web框架的实例 */
    s(this, "_platformInstance");
    this._serverPlatform = e;
  }
  /* 创建Server对象 */
  static async create(e) {
    const t = new c(e);
    return await t._init(), t;
  }
  /* 返回Web框架的实例 */
  get platformInstance() {
    return this._platformInstance;
  }
  /* 启动服务器 */
  async bootstrap(e = {}) {
    e.port || (e.port = b), this._serverPlatform.bootstrap(e);
  }
  /* 初始化Web服务器 */
  async _init() {
    this._platformInstance = await this._serverPlatform.create(), this._dependencyInjection.load({ moduleName: h });
  }
};
l(c, "Server");
let y = c;
function E(r) {
  const e = p.getOrCreateMetadata(r), t = e.userData;
  return t.__server__ || (t.__server__ = !0, t.__server__isController = !1, t.__server__metadata = e, t.__server__routePrefix = "", t.__server__controllerMethods = {}), t;
}
l(E, "getOrCreateMetadataUserData");
function M(r, e) {
  const t = E(r);
  let a = t.__server__controllerMethods[e];
  if (!a) {
    a = {
      methodName: e,
      methodType: "GET",
      paramtypes: {},
      route: "",
      routePrefix: ""
    };
    for (let n = 0; n < e.length; n++) {
      let _ = e[n];
      /[A-Z]/.test(_) && (_ = _.toLowerCase(), n > 0 && (_ = "-" + _)), a.route += _;
    }
    t.__server__controllerMethods[e] = a;
  }
  return a;
}
l(M, "getOrCreateControllerMethod");
function q(r) {
  const e = T({
    createImmediately: !0,
    singleton: !0,
    moduleName: h
  });
  return (t, a) => {
    e(t, a);
    const n = E(t);
    n.__server__isController = !0, n.__server__routePrefix = (r == null ? void 0 : r.routePrefix) ?? "";
  };
}
l(q, "Controller");
function O(r) {
  return (e, t) => {
    t = m(t);
    const a = M(e, t);
    if (r != null && r.type && (a.methodType = r.type), r != null && r.route && (a.route = r.route), r != null && r.routePrefix && (a.routePrefix = r.routePrefix), r != null && r.paramtypes)
      for (let _ in r.paramtypes)
        a.paramtypes[_] || (a.paramtypes[_] = r.paramtypes[_]);
    const n = Reflect.getMetadata(
      "design:paramtypes",
      e,
      t
    );
    if (n)
      for (let _ = 0; _ < n.length; _++)
        a.paramtypes[_] || (a.paramtypes[_] = n[_].name);
  };
}
l(O, "Method");
function u(r) {
  return (e, t, a) => {
    t = m(t);
    const n = M(e, t);
    n.paramtypes[a] = r.label;
  };
}
l(u, "ParamType");
function Y() {
  return u({ label: R });
}
l(Y, "Req");
function w() {
  return u({ label: A });
}
l(w, "Res");
function Q() {
  return u({ label: C });
}
l(Q, "ReqBody");
function j() {
  return u({ label: x });
}
l(j, "ReqQuery");
const f = class f {
  constructor() {
    /* Web框架的原请求对象 */
    s(this, "original");
    /* 读取session内容 */
    s(this, "session");
    /* 请求头 */
    s(this, "headers");
    /* 请求体内容 */
    s(this, "body");
    /* 上传的文件 */
    s(this, "files");
    /* Get request URL. */
    s(this, "url");
    /**
     * Get origin of URL.
     */
    s(this, "origin");
    /**
     * Get full request URL.
     */
    s(this, "href");
    /**
     * Get request method.
     */
    s(this, "method");
    /**
     * Get request pathname.
     * Set pathname, retaining the query-string when present.
     */
    s(this, "path");
    /**
     * Get parsed query-string.
     * Set query-string as an object.
     */
    s(this, "query");
    /**
     * Get query string.
     */
    s(this, "querystring");
    /**
     * Get the search string. Same as the querystring
     * except it includes the leading ?.
     */
    s(this, "search");
    /**
     * Parse the "Host" header field host
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
    s(this, "host");
    /**
     * Parse the "Host" header field hostname
     * and support X-Forwarded-Host when a
     * proxy is enabled.
     */
    s(this, "hostname");
    /**
     * Get WHATWG parsed URL object.
     */
    s(this, "URL");
  }
};
l(f, "ServerRequest");
let d = f;
const i = class i {
  constructor() {
    /* Web框架的原响应对象 */
    s(this, "original");
    /* 响应头 */
    s(this, "headers");
    /* 更新session内容 */
    s(this, "session");
    /* 状态码 */
    s(this, "statusCode");
  }
  /* 发送响应体 */
  body(e) {
  }
  /* 发送文件 */
  sendFile(e) {
    return Promise.resolve();
  }
  /* 重定向 */
  redirect(e) {
  }
};
l(i, "ServerResponse");
let P = i;
export {
  q as Controller,
  b as DEFAULT_PORT,
  h as MODULE_NAME,
  O as Method,
  R as PARAMTYPES_REQUEST,
  C as PARAMTYPES_REQUEST_BODY,
  x as PARAMTYPES_REQUEST_QUERY,
  A as PARAMTYPES_RESPONSE,
  u as ParamType,
  Y as Req,
  Q as ReqBody,
  j as ReqQuery,
  w as Res,
  y as Server,
  d as ServerRequest,
  P as ServerResponse
};
