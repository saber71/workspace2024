var C = Object.defineProperty;
var I = (r, e, a) => e in r ? C(r, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : r[e] = a;
var l = (r, e) => C(r, "name", { value: e, configurable: !0 });
var d = (r, e, a) => (I(r, typeof e != "symbol" ? e + "" : e, a), a);
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
    /* 构造函数所有参数的类型 */
    d(this, "constructorParameterTypes", []);
    /* 字段名映射其类型名 */
    d(this, "fieldTypes", {});
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
      let s = Object.getPrototypeOf(a);
      for (; s != null && s.name; ) {
        t.parentClassNames.push(s.name);
        let n = this._classNameMapMetadata.get(s.name);
        n && n !== t && t.merge(n), s = Object.getPrototypeOf(s);
      }
    }
    return t;
  }
  get userData() {
    return this._userData;
  }
  /* 合并父类的Metadata内容 */
  merge(e) {
    return this.fieldTypes = Object.assign({}, e.fieldTypes, this.fieldTypes), this._userData = Object.assign({}, e._userData, this._userData), this;
  }
};
l(h, "Metadata"), /* 类名映射Metadata对象，如果存在子类，会用子类的Metadata对象合并父类的Metadata对象 */
d(h, "_classNameMapMetadata", /* @__PURE__ */ new Map());
let u = h;
function z(r) {
  return typeof r == "string" ? r : (r == null ? void 0 : r.name) ?? "";
}
l(z, "getDecoratedName");
function $(r) {
  return (e, a) => {
    const t = r == null ? void 0 : r.paramtypes, s = u.getOrCreateMetadata(e);
    if (s.injectable = !0, s.moduleName = r == null ? void 0 : r.moduleName, s.singleton = r == null ? void 0 : r.singleton, s.createImmediately = r == null ? void 0 : r.createImmediately, t)
      for (let i in t) {
        const f = Number(i);
        s.constructorParameterTypes[f] || (s.constructorParameterTypes[f] = t[i]);
      }
    const n = Reflect.getMetadata("design:paramtypes", e) ?? [];
    for (let i = 0; i < n.length; i++)
      s.constructorParameterTypes[i] || (s.constructorParameterTypes[i] = n[i].name);
  };
}
l($, "Injectable");
function k(r) {
  return (e, a, t) => {
    var s;
    if (a = z(a), typeof t == "number") {
      const n = u.getOrCreateMetadata(e);
      r && (n.constructorParameterTypes[t] = r);
    } else {
      const n = r || ((s = Reflect.getMetadata("design:type", e, a)) == null ? void 0 : s.name);
      if (!n)
        throw new b(
          "无法通过元数据获取字段类型，必须指定类型"
        );
      const i = u.getOrCreateMetadata(e);
      i.fieldTypes[a] = n;
    }
  };
}
l(k, "Inject");
const N = class N extends Error {
};
l(N, "InjectNotFoundTypeError");
let b = N;
const T = class T {
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
      throw new g("绑定的值不能是undefined");
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
      throw new _(`容器内不存在名为${e}的标识符`);
    }
    let s = t.value;
    if (s === void 0 && (t.factory ? s = t.factory(...a) : (s = t.getterValue, s === void 0 && t.getter && (s = t.getterValue = t.getter(), t.getter = void 0))), s === void 0)
      throw new g("从容器获取的值不能是undefined");
    return s;
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
l(T, "Container");
let y = T;
const v = class v extends y {
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
      throw new p(
        "Container.load方法已被调用过，不能重复调用"
      );
    this._loaded = !0;
    const t = Array.from(u.getAllMetadata());
    this.loadFromMetadata(t, a);
  }
  /* 从元数据中加载内容进容器中 */
  loadFromMetadata(a, t = {}) {
    const { overrideParent: s = !0, moduleName: n } = t;
    a = a.filter(
      (m) => !n || !m.moduleName || m.moduleName === n
    );
    for (let m of a)
      this._newMember(m.clazz.name, m);
    if (s)
      for (let m of a) {
        const c = this._memberMap.get(m.clazz.name);
        if (c.name === m.clazz.name)
          for (let M of m.parentClassNames)
            this._memberMap.set(M, c);
      }
    const i = [], f = /* @__PURE__ */ new Set();
    for (let m of this._memberMap.values()) {
      const { metadata: c } = m;
      if (c) {
        const { clazz: M, fieldTypes: x } = c, D = /* @__PURE__ */ l(() => {
          if (f.has(m.name))
            throw new w(
              "依赖循环：" + Array.from(f).join("->") + m.name
            );
          f.add(m.name);
          const A = new M(
            ...c.constructorParameterTypes.map(
              (o) => this.getValue(o)
            )
          );
          for (let o in x)
            A[o] = this.getValue(x[o]);
          return f.delete(m.name), A;
        }, "generator");
        c.createImmediately && i.push(m), c.singleton ? m.getter = D : m.factory = D;
      }
    }
    for (let m of i)
      this.getValue(m.name);
  }
  /* 将提供的类绑定进容器内 */
  loadFromClass(a, t = {}) {
    this.loadFromMetadata(
      a.map((s) => u.getOrCreateMetadata(s)),
      t
    );
  }
};
l(v, "LoadableContainer");
let F = v;
const O = class O extends Error {
};
l(O, "ContainerRepeatLoadError");
let p = O;
const j = class j extends Error {
};
l(j, "DependencyCycleError");
let w = j;
const P = class P extends Error {
};
l(P, "InvalidValueError");
let g = P;
const V = class V extends Error {
};
l(V, "NotExistLabelError");
let _ = V;
export {
  y as Container,
  p as ContainerRepeatLoadError,
  w as DependencyCycleError,
  k as Inject,
  b as InjectNotFoundTypeError,
  $ as Injectable,
  g as InvalidValueError,
  F as LoadableContainer,
  u as Metadata,
  _ as NotExistLabelError,
  z as getDecoratedName
};
