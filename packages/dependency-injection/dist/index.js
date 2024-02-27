var F = Object.defineProperty;
var C = (s, e, a) => e in s ? F(s, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : s[e] = a;
var n = (s, e) => F(s, "name", { value: e, configurable: !0 });
var d = (s, e, a) => (C(s, typeof e != "symbol" ? e + "" : e, a), a);
import "reflect-metadata";
const h = class h {
  constructor(e) {
    /* 标识类是否已被装饰器Injectable装饰 */
    d(this, "injectable", !1);
    /* 类所属的模块 */
    d(this, "moduleName");
    /* 类是否是单例的 */
    d(this, "singleton");
    /* 类是否立即实例化 */
    d(this, "createImmediately");
    /* 保存方法的入参类型。方法名为key */
    d(this, "methodNameMapParameterTypes", {});
    /* 字段名映射其类型名 */
    d(this, "_fieldTypes", {});
    /* 父类的名字 */
    d(this, "parentClassNames", []);
    /* 保存用户自定义数据 */
    d(this, "_userData", {});
    this.clazz = e;
  }
  /* 获取所有的Metadata对象 */
  static getAllMetadata() {
    return this._classNameMapMetadata.values();
  }
  /**
   * 获取类对应的Metadata对象，如果对象不存在就新建一个。在新建Metadata对象的时候，子类的Metadata对象会合并父类的Metadata对象
   * @param clazzOrPrototype 可以是类或是类的原型
   */
  static getOrCreateMetadata(e) {
    let a;
    typeof e == "object" ? a = e.constructor : a = e;
    let t = this._classNameMapMetadata.get(a.name);
    if (!t) {
      this._classNameMapMetadata.set(
        a.name,
        t = new h(a)
      );
      let r = Object.getPrototypeOf(a);
      for (; r != null && r.name; ) {
        t.parentClassNames.push(r.name);
        let i = this._classNameMapMetadata.get(r.name);
        i && i !== t && t.merge(i), r = Object.getPrototypeOf(r);
      }
    }
    return t;
  }
  get fieldTypes() {
    return this._fieldTypes;
  }
  get userData() {
    return this._userData;
  }
  /* 合并父类的Metadata内容 */
  merge(e) {
    return this._fieldTypes = Object.assign({}, e._fieldTypes, this._fieldTypes), this._userData = Object.assign({}, e._userData, this._userData), this;
  }
  /* 根据方法名获取保存了入参类型的数据结构 */
  getMethodParameterTypes(e = "constructor") {
    return e === "constructor" && (e = "_" + e), this.methodNameMapParameterTypes[e] || (this.methodNameMapParameterTypes[e] = {
      types: [],
      getters: {}
    }), this.methodNameMapParameterTypes[e];
  }
};
n(h, "Metadata"), /* 类名映射Metadata对象，如果存在子类，会用子类的Metadata对象合并父类的Metadata对象 */
d(h, "_classNameMapMetadata", /* @__PURE__ */ new Map());
let u = h;
function R(s) {
  return typeof s == "string" ? s : (s == null ? void 0 : s.name) ?? "";
}
n(R, "getDecoratedName");
function I(s, e, a) {
  if (!(e != null && e.paramtypes) && !(e != null && e.paramGetters) && !a)
    throw new g(
      "无法通过元数据获取方法入参类型，必须指定类型"
    );
  if (e) {
    if (e.paramtypes)
      for (let t in e.paramtypes) {
        const r = Number(t);
        s.types[r] || (s.types[r] = e.paramtypes[t]);
      }
    if (e.paramGetters)
      for (let t in e.paramGetters)
        e.paramGetters[t] || (s.getters[t] = e.paramGetters[t]);
  }
  if (a)
    for (let t = 0; t < a.length; t++)
      s.types[t] || (s.types[t] = a[t].name);
}
n(I, "fillInMethodParameterTypes");
function k(s) {
  return (e, a) => {
    const t = u.getOrCreateMetadata(e);
    t.injectable = !0, t.moduleName = s == null ? void 0 : s.moduleName, t.singleton = s == null ? void 0 : s.singleton, t.createImmediately = s == null ? void 0 : s.createImmediately;
    const r = t.getMethodParameterTypes();
    I(
      r,
      s,
      Reflect.getMetadata("design:paramtypes", e)
    );
  };
}
n(k, "Injectable");
function q(s) {
  return (e, a, t) => {
    var f;
    a = R(a) || "constructor";
    const r = s == null ? void 0 : s.typeLabel, i = s == null ? void 0 : s.typeValueGetter;
    if (typeof t == "number") {
      const m = u.getOrCreateMetadata(e).getMethodParameterTypes(a);
      r && (m.types[t] = r), i && (m.getters[t] = i);
    } else {
      const c = u.getOrCreateMetadata(e), m = Reflect.getMetadata("design:paramtypes", e, a);
      if (m) {
        const l = c.getMethodParameterTypes(a);
        I(l, s, m);
      } else {
        const l = r || ((f = Reflect.getMetadata("design:type", e, a)) == null ? void 0 : f.name);
        if (!l && !i)
          throw new g(
            "无法通过元数据获取字段类型，必须指定类型"
          );
        c.fieldTypes[a] = { type: l, getter: i };
      }
    }
  };
}
n(q, "Inject");
const P = class P extends Error {
};
n(P, "InjectNotFoundTypeError");
let g = P;
const o = class o {
  constructor() {
    /* 缓存容器中的内容，名字映射Member对象 */
    d(this, "_memberMap", /* @__PURE__ */ new Map());
    /* 父容器。在当前容器中找不到值时，会尝试在父容器中寻找 */
    d(this, "_extend");
  }
  /* 设置要继承的父容器。当从容器中找不到值时，会尝试在父容器中寻找 */
  extend(e) {
    return this._extend = e, this;
  }
  /**
   * 给指定的标识符绑定值
   * @param label 标识符
   * @param value 指定的值
   * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
   */
  bindValue(e, a) {
    if (a === void 0)
      throw new M("绑定的值不能是undefined");
    let t = this._memberMap.get(e);
    return t || (t = this._newMember(e)), t.value = a, this;
  }
  /* 给指定的标识符绑定一个工厂函数，在每次访问时生成一个新值 */
  bindFactory(e, a) {
    let t = this._memberMap.get(e);
    return t || (t = this._newMember(e)), t.factory = a, this;
  }
  /* 给指定的标识符绑定一个getter，只在第一次访问时执行 */
  bindGetter(e, a) {
    let t = this._memberMap.get(e);
    return t || (t = this._newMember(e)), t.getter = a, t.getterValue = void 0, this;
  }
  /* 解绑指定的标识符 */
  unbind(e) {
    return this._memberMap.delete(e), this;
  }
  /* 解绑所有标识符 */
  unbindAll() {
    this._memberMap.clear();
  }
  /* 释放资源 */
  dispose() {
    this.unbindAll(), this.extend(void 0);
  }
  /**
   * 获取指定标识符的值
   * @param label 要获取值的标识符
   * @param args 生成值所需的参数
   * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
   * @throws NotExistLabelError 当从容器访问一个不存在的标识符时抛出
   */
  getValue(e, ...a) {
    typeof e != "string" && (e = e.name);
    const t = this._memberMap.get(e);
    if (!t) {
      if (this._extend)
        return this._extend.getValue(e, ...a);
      throw new p(`容器内不存在名为${e}的标识符`);
    }
    let r = t.value;
    if (r === void 0 && (t.factory ? r = t.factory(...a) : (r = t.getterValue, r === void 0 && t.getter && (r = t.getterValue = t.getter(), t.getter = void 0))), r === void 0)
      throw new M("从容器获取的值不能是undefined");
    return r;
  }
  /* 生成并缓存一个新Member对象 */
  _newMember(e, a) {
    const t = {
      name: e,
      metadata: a
    };
    return this._memberMap.set(e, t), t;
  }
};
n(o, "Container");
let _ = o;
const V = class V extends _ {
  constructor() {
    super(...arguments);
    /* 标识是否调用过load方法 */
    d(this, "_loaded", !1);
  }
  /**
   * 加载所有已被装饰器Injectable装饰的类且所属于指定的模块
   * @throws ContainerRepeatLoadError 当重复调用Container.load方法时抛出
   */
  load(a = {}) {
    if (this._loaded)
      throw new b(
        "Container.load方法已被调用过，不能重复调用"
      );
    this._loaded = !0;
    const t = Array.from(u.getAllMetadata());
    this.loadFromMetadata(t, a);
  }
  /* 从元数据中加载内容进容器中 */
  loadFromMetadata(a, t = {}) {
    const { overrideParent: r = !0, moduleName: i } = t;
    a = a.filter(
      (m) => !i || !m.moduleName || m.moduleName === i
    );
    for (let m of a)
      this._newMember(m.clazz.name, m);
    if (r)
      for (let m of a) {
        const l = this._memberMap.get(m.clazz.name);
        if (l.name === m.clazz.name)
          for (let y of m.parentClassNames)
            this._memberMap.set(y, l);
      }
    const f = [], c = /* @__PURE__ */ new Set();
    for (let m of this._memberMap.values()) {
      const { metadata: l } = m;
      if (l) {
        const { clazz: y, fieldTypes: N } = l, T = /* @__PURE__ */ n(() => {
          if (c.has(m.name))
            throw new w(
              "依赖循环：" + Array.from(c).join("->") + m.name
            );
          c.add(m.name);
          const x = new y(
            ...l.methodNameMapParameterTypes.constructor
          );
          for (let D in N)
            x[D] = this._getFieldValue(N[D]);
          return c.delete(m.name), x;
        }, "generator");
        l.createImmediately && f.push(m), l.singleton ? m.getter = T : m.factory = T;
      }
    }
    for (let m of f)
      this.getValue(m.name);
  }
  /* 将提供的类绑定进容器内 */
  loadFromClass(a, t = {}) {
    this.loadFromMetadata(
      a.map((r) => u.getOrCreateMetadata(r)),
      t
    );
  }
  /* 获取方法的入参 */
  _getMethodParameters(a) {
    return a ? a.types.map(
      (t, r) => {
        var i, f;
        return ((f = (i = a.getters)[r]) == null ? void 0 : f.call(i, this)) ?? this.getValue(t);
      }
    ) : [];
  }
  /* 获取字段的值 */
  _getFieldValue(a) {
    var t;
    if (!a.getter && !a.type)
      throw new Error("无法通过元数据获取字段类型，必须指定类型");
    return ((t = a.getter) == null ? void 0 : t.call(a, this)) ?? this.getValue(a.type);
  }
};
n(V, "LoadableContainer");
let A = V;
const v = class v extends Error {
};
n(v, "ContainerRepeatLoadError");
let b = v;
const O = class O extends Error {
};
n(O, "DependencyCycleError");
let w = O;
const j = class j extends Error {
};
n(j, "InvalidValueError");
let M = j;
const G = class G extends Error {
};
n(G, "NotExistLabelError");
let p = G;
export {
  _ as Container,
  b as ContainerRepeatLoadError,
  w as DependencyCycleError,
  q as Inject,
  g as InjectNotFoundTypeError,
  k as Injectable,
  M as InvalidValueError,
  A as LoadableContainer,
  u as Metadata,
  p as NotExistLabelError,
  I as fillInMethodParameterTypes,
  R as getDecoratedName
};
