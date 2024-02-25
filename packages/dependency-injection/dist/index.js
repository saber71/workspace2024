var A = Object.defineProperty;
var C = (s, e, t) => e in s ? A(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var c = (s, e) => A(s, "name", { value: e, configurable: !0 });
var f = (s, e, t) => (C(s, typeof e != "symbol" ? e + "" : e, t), t);
import "reflect-metadata";
const u = class u {
  constructor(e) {
    /* 标识类是否已被装饰器Injectable装饰 */
    f(this, "injectable", !1);
    /* 类所属的模块 */
    f(this, "moduleName");
    /* 类是否是单例的 */
    f(this, "singleton");
    /* 类是否立即实例化 */
    f(this, "createImmediately");
    /* 构造函数所有参数的类型 */
    f(this, "constructorParameterTypes", []);
    /* 字段名映射其类型名 */
    f(this, "fieldTypes", {});
    /* 父类的名字 */
    f(this, "parentClassNames", []);
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
    let t;
    typeof e == "object" ? t = e.constructor : t = e;
    let a = this._classNameMapMetadata.get(t.name);
    if (!a) {
      this._classNameMapMetadata.set(
        t.name,
        a = new u(t)
      );
      let m = Object.getPrototypeOf(t);
      for (; m != null && m.name; ) {
        a.parentClassNames.push(m.name);
        let i = this._classNameMapMetadata.get(m.name);
        i && i !== a && a.merge(i), m = Object.getPrototypeOf(m);
      }
    }
    return a;
  }
  /* 合并父类的Metadata内容 */
  merge(e) {
    return this.fieldTypes = Object.assign({}, e.fieldTypes, this.fieldTypes), this;
  }
};
c(u, "Metadata"), /* 类名映射Metadata对象，如果存在子类，会用子类的Metadata对象合并父类的Metadata对象 */
f(u, "_classNameMapMetadata", /* @__PURE__ */ new Map());
let d = u;
function I(s) {
  return typeof s == "string" ? s : (s == null ? void 0 : s.name) ?? "";
}
c(I, "getDecoratedName");
function S(s) {
  return (e, t) => {
    const a = s == null ? void 0 : s.paramtypes, m = d.getOrCreateMetadata(e);
    if (m.injectable = !0, m.moduleName = s == null ? void 0 : s.moduleName, m.singleton = s == null ? void 0 : s.singleton, m.createImmediately = s == null ? void 0 : s.createImmediately, a)
      for (let n in a) {
        const r = Number(n);
        m.constructorParameterTypes[r] || (m.constructorParameterTypes[r] = a[n]);
      }
    const i = Reflect.getMetadata("design:paramtypes", e) ?? [];
    for (let n = 0; n < i.length; n++)
      m.constructorParameterTypes[n] || (m.constructorParameterTypes[n] = i[n].name);
  };
}
c(S, "Injectable");
function $(s) {
  return (e, t, a) => {
    var m;
    if (t = I(t), typeof a == "number") {
      const i = d.getOrCreateMetadata(e);
      s && (i.constructorParameterTypes[a] = s);
    } else {
      const i = s || ((m = Reflect.getMetadata("design:type", e, t)) == null ? void 0 : m.name);
      if (!i)
        throw new M(
          "无法通过元数据获取字段类型，必须指定类型"
        );
      const n = d.getOrCreateMetadata(e);
      n.fieldTypes[t] = i;
    }
  };
}
c($, "Inject");
const p = class p extends Error {
};
c(p, "InjectNotFoundTypeError");
let M = p;
const _ = class _ {
  constructor() {
    /* 标识是否调用过load方法 */
    f(this, "_loaded", !1);
    /* 缓存容器中的内容，名字映射Member对象 */
    f(this, "_memberMap", /* @__PURE__ */ new Map());
    /* 父容器。在当前容器中找不到值时，会尝试在父容器中寻找 */
    f(this, "_extend");
  }
  /* 设置要继承的父容器。当从容器中找不到值时，会尝试在父容器中寻找 */
  extend(e) {
    return this._extend = e, this;
  }
  /**
   * 加载所有已被装饰器Injectable装饰的类且所属于指定的模块
   * @param option.moduleName 可选。指定要被加载的模块，与装饰器Injectable入参中的moduleName相同
   * @param option.overrideParent 默认true。是否让子类覆盖父类的实例。如果为true，则通过父类名字拿到的，并非是其自身的实例，而是子类的实例
   * @throws ContainerRepeatLoadError 当重复调用Container.load方法时抛出
   */
  load(e = {}) {
    if (this._loaded)
      throw new y(
        "Container.load方法已被调用过，不能重复调用"
      );
    this._loaded = !0;
    const { overrideParent: t = !0, moduleName: a } = e, m = Array.from(d.getAllMetadata()).filter(
      (r) => !a || !r.moduleName || r.moduleName === a
    );
    for (let r of m)
      this._newMember(r.clazz.name, r);
    if (t)
      for (let r of m) {
        const l = this._memberMap.get(r.clazz.name);
        if (l.name === r.clazz.name)
          for (let o of r.parentClassNames)
            this._memberMap.set(o, l);
      }
    const i = [], n = /* @__PURE__ */ new Set();
    for (let r of this._memberMap.values()) {
      const { metadata: l } = r;
      if (l) {
        const { clazz: o, fieldTypes: j } = l, O = /* @__PURE__ */ c(() => {
          if (n.has(r.name))
            throw new b(
              "依赖循环：" + Array.from(n).join("->") + r.name
            );
          n.add(r.name);
          const V = new o(
            ...l.constructorParameterTypes.map(
              (g) => this.getValue(g)
            )
          );
          for (let g in j)
            V[g] = this.getValue(j[g]);
          return n.delete(r.name), V;
        }, "generator");
        l.createImmediately && i.push(r), l.singleton ? r.getter = O : r.factory = O;
      }
    }
    for (let r of i)
      this.getValue(r.name);
  }
  /**
   * 给指定的标识符绑定值
   * @param label 标识符
   * @param value 指定的值
   * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
   */
  bindValue(e, t) {
    if (t === void 0)
      throw new h("绑定的值不能是undefined");
    let a = this._memberMap.get(e);
    return a || (a = this._newMember(e)), a.value = t, this;
  }
  /* 给指定的标识符绑定一个工厂函数，在每次访问时生成一个新值 */
  bindFactory(e, t) {
    let a = this._memberMap.get(e);
    return a || (a = this._newMember(e)), a.factory = t, this;
  }
  /* 给指定的标识符绑定一个getter，只在第一次访问时执行 */
  bindGetter(e, t) {
    let a = this._memberMap.get(e);
    return a || (a = this._newMember(e)), a.getter = t, a.getterValue = void 0, this;
  }
  /* 解绑指定的标识符 */
  unbind(e) {
    return this._memberMap.delete(e), this;
  }
  /**
   * 获取指定标识符的值
   * @param label 要获取值的标识符
   * @throws InvalidValueError 当从容器获取值，如果值不合法时抛出
   * @throws NotExistLabelError 当从容器访问一个不存在的标识符时抛出
   */
  getValue(e) {
    typeof e != "string" && (e = e.name);
    const t = this._memberMap.get(e);
    if (!t) {
      if (this._extend)
        return this._extend.getValue(e);
      throw new w(`容器内不存在名为${e}的标识符`);
    }
    let a = t.value ?? t.getterValue;
    if (a === void 0 && (t.factory ? a = t.factory() : t.getter && (a = t.getterValue = t.getter(), t.getter = void 0)), a === void 0)
      throw new h("从容器获取的值不能是undefined");
    return a;
  }
  /* 生成并缓存一个新Member对象 */
  _newMember(e, t) {
    const a = {
      name: e,
      metadata: t
    };
    return this._memberMap.set(e, a), a;
  }
};
c(_, "Container");
let x = _;
const N = class N extends Error {
};
c(N, "ContainerRepeatLoadError");
let y = N;
const T = class T extends Error {
};
c(T, "DependencyCycleError");
let b = T;
const v = class v extends Error {
};
c(v, "InvalidValueError");
let h = v;
const P = class P extends Error {
};
c(P, "NotExistLabelError");
let w = P;
export {
  x as Container,
  y as ContainerRepeatLoadError,
  b as DependencyCycleError,
  $ as Inject,
  M as InjectNotFoundTypeError,
  S as Injectable,
  h as InvalidValueError,
  d as Metadata,
  w as NotExistLabelError,
  I as getDecoratedName
};
