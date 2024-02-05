var y = Object.defineProperty;
var r = (i, l) => y(i, "name", { value: l, configurable: !0 });
import "reflect-metadata";
import { Container as C, injectable as O, inject as M } from "inversify";
var m;
((i) => {
  const l = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
  function p(t = "") {
    let e = f.get(t);
    return e || f.set(
      t,
      e = new C({ skipBaseClassChecks: !0 })
    ), e;
  }
  r(p, "getContainer"), i.getContainer = p;
  function u(t) {
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
  r(u, "getInjectableOptionOrCreate");
  function g(t) {
    const e = O();
    return (o) => {
      e(o), Object.assign(u(o), t);
    };
  }
  r(g, "Injectable"), i.Injectable = g;
  function d(t) {
    return M(t);
  }
  r(d, "Inject"), i.Inject = d;
  function b(t = "") {
    const e = p(t), o = new Map(l);
    for (let [n, s] of l.entries())
      s.moduleName && t !== s.moduleName ? o.delete(n) : s.prototypeNames.slice(1).forEach((c) => o.delete(c));
    const a = [];
    for (let n of o.values()) {
      n.createOnLoad && a.push(n);
      for (let s = 0; s < n.prototypeNames.length; s++) {
        const c = n.prototypeNames[s];
        n.singleton ? s === 0 ? e.bind(c).to(n.targetClass).inSingletonScope() : e.bind(c).toDynamicValue(() => e.get(n.targetClass.name)) : e.bind(c).to(n.targetClass);
      }
    }
    for (let n of a)
      e.get(n.targetClass.name);
  }
  r(b, "load"), i.load = b;
  function h(t = "") {
    const e = f.get(t);
    e && (e.unbindAll(), f.delete(t));
  }
  r(h, "unload"), i.unload = h;
  function j(t, e) {
    const o = p(e).get(t.name);
    if (!o)
      throw new Error(`Unable to find instance of class ${t.name}`);
    return o;
  }
  r(j, "getInstance"), i.getInstance = j;
  async function w(t) {
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
  r(w, "importAll"), i.importAll = w;
})(m || (m = {}));
export {
  m as IoC
};
