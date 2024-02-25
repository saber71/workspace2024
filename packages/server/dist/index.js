var o = Object.defineProperty;
var i = (e, t, n) => t in e ? o(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var a = (e, t) => o(e, "name", { value: t, configurable: !0 });
var s = (e, t, n) => (i(e, typeof t != "symbol" ? t + "" : t, n), n);
import { Container as l } from "dependency-injection";
const p = "server", m = 4e3, r = class r {
  constructor(t) {
    /* 依赖注入的容器 */
    s(this, "_dependencyInjection", new l());
    /* Web框架的实例 */
    s(this, "_platformInstance");
    this._serverPlatform = t;
  }
  /* 创建Server对象 */
  static async create(t) {
    const n = new r(t);
    return await n._init(), n;
  }
  /* 返回Web框架的实例 */
  get platformInstance() {
    return this._platformInstance;
  }
  /* 启动服务器 */
  async bootstrap(t = {}) {
    t.port || (t.port = m), this._serverPlatform.bootstrap(t);
  }
  /* 初始化Web服务器 */
  async _init() {
    this._platformInstance = await this._serverPlatform.create(), this._dependencyInjection.load({ moduleName: p });
  }
};
a(r, "Server");
let c = r;
function d() {
}
a(d, "Controller");
export {
  d as Controller,
  m as DEFAULT_PORT,
  p as MODULE_NAME,
  c as Server
};
