var T = Object.defineProperty;
var N = (r, e, t) => e in r ? T(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var n = (r, e) => T(r, "name", { value: e, configurable: !0 });
var p = (r, e, t) => (N(r, typeof e != "symbol" ? e + "" : e, t), t);
import { IoC as l } from "ioc";
import { Service as v, ModuleName as L } from "vue-class";
import V from "dexie";
import { IndexDBTable as M } from "indexdb-table";
var R = Object.defineProperty, z = Object.getOwnPropertyDescriptor, E = /* @__PURE__ */ n((r, e, t, s) => {
  for (var a = s > 1 ? void 0 : s ? z(e, t) : e, i = r.length - 1, o; i >= 0; i--)
    (o = r[i]) && (a = (s ? o(e, t, a) : o(a)) || a);
  return s && a && R(e, t, a), a;
}, "__decorateClass$3"), c;
let P = (c = class {
  /* 检查入参是否是合法的邮件地址 */
  isEmail(e) {
    return /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/.test(
      e
    );
  }
}, n(c, "CommonService"), c);
P = E([
  v({ singleton: !0, createOnLoad: !0 })
], P);
var A = Object.defineProperty, G = Object.getOwnPropertyDescriptor, U = /* @__PURE__ */ n((r, e, t, s) => {
  for (var a = s > 1 ? void 0 : s ? G(e, t) : e, i = r.length - 1, o; i >= 0; i--)
    (o = r[i]) && (a = (s ? o(e, t, a) : o(a)) || a);
  return s && a && A(e, t, a), a;
}, "__decorateClass$2"), D = /* @__PURE__ */ n((r, e) => (t, s) => e(t, s, r), "__decorateParam$2"), u;
let j = (u = class extends V {
  constructor(t, s) {
    super(t);
    p(this, "_indexdbTableMap", {});
    this.databaseName = t, this.tableNames = s;
    const a = {
      keyValue: "&key,value,readonly",
      user: "&key,value",
      userProfile: "&key,value"
    };
    for (let i of s)
      a[i] = "&key,value";
    this.version(1).stores(a);
    for (let i of ["user", "userProfile", "keyValue", ...s])
      this._indexdbTableMap[i] = new M(
        this._allTables[i]
      );
  }
  /* 获取对应名字的IndexdbTable对象 */
  getTable(t) {
    return this._indexdbTableMap[t];
  }
}, n(u, "IndexDBService"), u);
j = U([
  v({ singleton: !0, createOnLoad: !0 }),
  D(0, l.Inject("DatabaseName")),
  D(1, l.Inject("TableNames"))
], j);
var Z = Object.defineProperty, q = Object.getOwnPropertyDescriptor, H = /* @__PURE__ */ n((r, e, t, s) => {
  for (var a = s > 1 ? void 0 : s ? q(e, t) : e, i = r.length - 1, o; i >= 0; i--)
    (o = r[i]) && (a = (s ? o(e, t, a) : o(a)) || a);
  return s && a && Z(e, t, a), a;
}, "__decorateClass$1"), J = /* @__PURE__ */ n((r, e) => (t, s) => e(t, s, r), "__decorateParam$1"), h;
let $ = (h = class {
  constructor(e) {
    p(this, "dexieTable");
    this.indexedRepository = e, this.dexieTable = e.keyValue;
  }
  /* 根据key获取value，如果keu不存在则返回undefined */
  async getValue(e) {
    var t;
    return (t = await this.dexieTable.get(e)) == null ? void 0 : t.value;
  }
  /* 根据key获取value，如果keu不存在则报错 */
  async fetchValue(e) {
    const t = await this.dexieTable.get(e);
    if (!t)
      throw new b(
        "Unable to find the value corresponding to the key " + e
      );
    return t.value;
  }
  /* 更新键值对，如果键值对是只读的则抛出错误 */
  async setValue(e, t, s = !1) {
    let a = await this.dexieTable.get(e);
    if (a != null && a.readonly)
      throw new w(
        `The value corresponding to Key ${e} is read-only`
      );
    a ? (a.value = t, a.readonly = s) : a = { key: e, value: t, readonly: s }, await this.dexieTable.put(a, e);
  }
}, n(h, "KeyValueService"), h);
$ = H([
  v({ singleton: !0, createOnLoad: !0 }),
  J(0, l.Inject("IndexDBService"))
], $);
const x = class x extends Error {
};
n(x, "KeyValueReadonlyError");
let w = x;
const _ = class _ extends Error {
};
n(_, "KeyValueNotFoundError");
let b = _;
var Q = Object.defineProperty, X = Object.getOwnPropertyDescriptor, Y = /* @__PURE__ */ n((r, e, t, s) => {
  for (var a = s > 1 ? void 0 : s ? X(e, t) : e, i = r.length - 1, o; i >= 0; i--)
    (o = r[i]) && (a = (s ? o(e, t, a) : o(a)) || a);
  return s && a && Q(e, t, a), a;
}, "__decorateClass"), f = /* @__PURE__ */ n((r, e) => (t, s) => e(t, s, r), "__decorateParam"), d;
let B = (d = class {
  constructor(e, t, s, a) {
    this.indexedRepository = e, this.commonService = t, this.keyValueService = s, this.userStore = a;
  }
  /* 重置用户的密码，找不到用户时抛出错误 */
  async resetPassword(e) {
    const t = await this.fetchByLoginNameOrEmail(e.loginNameOrEmail);
    t.password = e.password, await this.indexedRepository.getTable("user").put(t);
  }
  /* 用户登陆 */
  async login(e) {
    const t = await this.fetchByLoginData(e);
    this.userStore.rememberLoginStatus = e.remember, await this.auth(t);
  }
  /* 游客登陆 */
  async guestLogin() {
    const e = await this.keyValueService.fetchValue("GuestID"), t = await this.fetchById(e);
    await this.auth(t);
  }
  /* 用户登陆后执行，获取用户数据 */
  async auth(e) {
    typeof e == "string" && (e = await this.fetchById(e)), this.userStore.loggedInUserId = e.id, this.userStore.userInfo = {
      ...e,
      profile: await this.indexedRepository.getTable("userProfile").getById(e.id)
    }, this.userStore.auth = !0;
  }
  /* 新建用户 */
  async create(e) {
    if (!!await this.indexedRepository.getTable("user").searchOne((i) => i.loginName === e.loginName))
      throw new y("登录名重复");
    const s = {
      ...e,
      createTime: /* @__PURE__ */ new Date()
    }, a = await this.indexedRepository.getTable("user").add(s);
    return this.indexedRepository.getTable("userProfile").add({
      id: a,
      avatar: void 0,
      name: ""
    });
  }
  /* 通过id获取用户，找不到用户时抛出错误 */
  async fetchById(e) {
    const t = await this.indexedRepository.getTable("user").getById(e);
    if (!t)
      throw new m(`找不到id ${e} 对应的用户`);
    return t;
  }
  /* 通过登录名或邮箱获取用户，找不到用户时抛出错误 */
  async fetchByLoginNameOrEmail(e) {
    const t = this.commonService.isEmail(e), s = await this.indexedRepository.getTable("user").searchOne(
      (a) => t ? a.email === e : a.loginName === e
    );
    if (!s)
      throw new m("找不到用户");
    return s;
  }
  /* 通过登陆数据获取用户，找不到用户时抛出错误 */
  async fetchByLoginData(e) {
    const t = await this.fetchByLoginNameOrEmail(e.loginNameOrEmail);
    if (t.password !== e.password)
      throw new g("密码不正确");
    return t;
  }
}, n(d, "UserService"), d);
B = Y([
  v({ singleton: !0, createOnLoad: !0 }),
  f(0, l.Inject("IndexDBService")),
  f(1, l.Inject("CommonService")),
  f(2, l.Inject("KeyValueService")),
  f(3, l.Inject("UseUserStore"))
], B);
const O = class O extends Error {
};
n(O, "UserNotFoundError");
let m = O;
const I = class I extends Error {
};
n(I, "UserWrongPasswordError");
let g = I;
const S = class S extends Error {
};
n(S, "UserRepeatLoginNameError");
let y = S;
var C;
((r) => {
  function e(t) {
    const s = l.getContainer(L);
    s.bind("DatabaseName").toConstantValue(t.databaseName), s.bind("TableNames").toConstantValue(t.tableNames), s.bind("UseUserStore").toConstantValue(t.userStore);
  }
  n(e, "setup"), r.setup = e;
})(C || (C = {}));
export {
  C as CommonService,
  j as IndexDBService,
  b as KeyValueNotFoundError,
  w as KeyValueReadonlyError,
  $ as KeyValueService,
  m as UserNotFoundError,
  y as UserRepeatLoginNameError,
  B as UserService,
  g as UserWrongPasswordError
};
