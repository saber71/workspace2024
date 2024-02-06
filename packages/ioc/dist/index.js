var M = Object.defineProperty;
var r = (i, l) => M(i, "name", { value: l, configurable: !0 });
import "reflect-metadata";
import { Container as N, injectable as P, inject as v } from "inversify";
var d;
((i) => {
  const l = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
  function u(t = "") {
    let e = f.get(t);
    return e || f.set(
      t,
      e = new N({ skipBaseClassChecks: !0 })
    ), e;
  }
  r(u, "getContainer"), i.getContainer = u;
  function b(t) {
    let e = l.get(t.name);
    if (!e) {
      const o = [];
      let a = t;
      for (; a != null && a.name; )
        o.push(a.name), a = Object.getPrototypeOf(a);
      l.set(
        t.name,
        e = {
          singleton: !1,
          createOnLoad: !1,
          targetClass: t,
          prototypeNames: o
        }
      );
    }
    return e;
  }
  r(b, "getInjectableOptionOrCreate");
  function h(t) {
    const e = P();
    return (o) => {
      e(o), Object.assign(b(o), t);
    };
  }
  r(h, "Injectable"), i.Injectable = h;
  function j(t) {
    return v(t);
  }
  r(j, "Inject"), i.Inject = j;
  function C(t = "") {
    const e = u(t), o = new Map(l);
    for (let [n, s] of l.entries())
      s.moduleName && t !== s.moduleName ? o.delete(n) : s.prototypeNames.slice(1).forEach((c) => o.delete(c));
    const a = [];
    for (let n of o.values()) {
      n.createOnLoad && a.push(n);
      for (let s = 0; s < n.prototypeNames.length; s++) {
        const c = n.prototypeNames[s];
        let p;
        n.singleton ? s === 0 ? p = e.bind(c).to(n.targetClass).inSingletonScope() : p = e.bind(c).toDynamicValue(() => e.get(n.targetClass.name)) : p = e.bind(c).to(n.targetClass), p.onActivation((A, m) => {
          var g;
          return (g = n.onCreate) == null || g.call(n, m), m;
        });
      }
    }
    for (let n of a)
      e.get(n.targetClass.name);
  }
  r(C, "load"), i.load = C;
  function w(t = "") {
    const e = f.get(t);
    e && (e.unbindAll(), f.delete(t));
  }
  r(w, "unload"), i.unload = w;
  function y(t, e) {
    const o = u(e).get(t.name);
    if (!o)
      throw new Error(`Unable to find instance of class ${t.name}`);
    return o;
  }
  r(y, "getInstance"), i.getInstance = y;
  async function O(t) {
    const e = t(), o = [];
    for (let a in e) {
      const n = e[a];
      if (typeof n == "function") {
        const s = n();
        s instanceof Promise && o.push(s);
      } else
        n instanceof Promise && o.push(n);
    }
    await Promise.all(o);
  }
  r(O, "importAll"), i.importAll = O;
})(d || (d = {}));
export {
  d as IoC
};
