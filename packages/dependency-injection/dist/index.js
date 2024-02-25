var d = Object.defineProperty;
var g = (t, e, a) => e in t ? d(t, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : t[e] = a;
var i = (t, e) => d(t, "name", { value: e, configurable: !0 });
var c = (t, e, a) => (g(t, typeof e != "symbol" ? e + "" : e, a), a);
import "reflect-metadata";
const o = class o {
  constructor(e) {
    /* 标识类是否已被装饰器Injectable装饰 */
    c(this, "injectable", !1);
    /* 构造函数所有参数的类型 */
    c(this, "constructorParameterTypes", []);
    /* 字段名映射其类型名 */
    c(this, "fieldTypes", {});
    /* 父类的名字 */
    c(this, "parentClassNames", []);
    this.clazz = e;
  }
  /*
   * 获取类对应的Metadata对象，如果对象不存在就新建一个。在新建Metadata对象的时候，子类的Metadata对象会合并父类的Metadata对象
   * 入参可以是类或是类的原型
   */
  static getOrCreateMetadata(e) {
    let a;
    typeof e == "object" ? a = e.constructor : a = e;
    let r = this._classNameMapMetadata.get(a.name);
    if (!r) {
      this._classNameMapMetadata.set(
        a.name,
        r = new o(a)
      );
      let n = Object.getPrototypeOf(a);
      for (; n != null && n.name; ) {
        r.parentClassNames.push(n.name);
        let s = this._classNameMapMetadata.get(n.name);
        s && s !== r && r.merge(s), n = Object.getPrototypeOf(n);
      }
    }
    return r;
  }
  /* 合并父类的Metadata内容 */
  merge(e) {
    return this.fieldTypes = Object.assign({}, e.fieldTypes, this.fieldTypes), this;
  }
};
i(o, "Metadata"), /* 类名映射Metadata对象，如果存在子类，会用子类的Metadata对象合并父类的Metadata对象 */
c(o, "_classNameMapMetadata", /* @__PURE__ */ new Map());
let f = o;
function p(t) {
  return typeof t == "string" ? t : (t == null ? void 0 : t.name) ?? "";
}
i(p, "getDecoratedName");
function h(t) {
  return (e, a) => {
    const r = f.getOrCreateMetadata(e);
    if (r.injectable = !0, t)
      for (let s in t) {
        const m = Number(s);
        r.constructorParameterTypes[m] || (r.constructorParameterTypes[m] = t[s]);
      }
    const n = Reflect.getMetadata("design:paramtypes", e) ?? [];
    for (let s = 0; s < n.length; s++)
      r.constructorParameterTypes[s] || (r.constructorParameterTypes[s] = n[s].name);
  };
}
i(h, "Injectable");
function T(t) {
  return (e, a, r) => {
    var n;
    if (a = p(a), typeof r == "number") {
      const s = f.getOrCreateMetadata(e);
      t && (s.constructorParameterTypes[r] = t);
    } else {
      const s = t || ((n = Reflect.getMetadata("design:type", e, a)) == null ? void 0 : n.name);
      if (!s)
        throw new l(
          "无法通过元数据获取字段类型，必须指定类型"
        );
      const m = f.getOrCreateMetadata(e);
      m.fieldTypes[a] = s;
    }
  };
}
i(T, "Inject");
const u = class u extends Error {
};
i(u, "InjectNotFoundTypeError");
let l = u;
export {
  T as Inject,
  l as InjectNotFoundTypeError,
  h as Injectable,
  f as Metadata,
  p as getDecoratedName
};
