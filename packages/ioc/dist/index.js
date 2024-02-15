var P = Object.defineProperty;
var s = (a, c) => P(a, "name", { value: c, configurable: !0 });
import "reflect-metadata";
import { Container as v, injectable as A, inject as I } from "inversify";
var h;
((a) => {
  const c = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  function m(t = "") {
    let e = p.get(t);
    return e || p.set(
      t,
      e = new v({ skipBaseClassChecks: !0 })
    ), e;
  }
  s(m, "getContainer"), a.getContainer = m;
  function j(t) {
    let e = c.get(t.name);
    if (!e) {
      const o = [];
      let i = t;
      for (; i != null && i.name; )
        o.push(i.name), i = Object.getPrototypeOf(i);
      c.set(
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
  s(j, "getInjectableOptionOrCreate");
  function y(t) {
    const e = A();
    return (o, i) => {
      e(o), Object.assign(j(o), t);
    };
  }
  s(y, "Injectable"), a.Injectable = y;
  function w(t) {
    return I(t);
  }
  s(w, "Inject"), a.Inject = w, a.Initializer = Symbol("initializer");
  const g = Symbol("initialized");
  function O(t = "") {
    const e = m(t), o = new Map(c);
    for (let [n, r] of c.entries())
      r.moduleName && t !== r.moduleName ? o.delete(n) : r.prototypeNames.slice(1).forEach((f) => o.delete(f));
    const i = [];
    for (let n of o.values()) {
      n.createOnLoad && i.push(n);
      for (let r = 0; r < n.prototypeNames.length; r++) {
        const f = n.prototypeNames[r];
        let u;
        n.singleton ? r === 0 ? u = e.bind(f).to(n.targetClass).inSingletonScope() : u = e.bind(f).toDynamicValue(() => e.get(n.targetClass.name)) : u = e.bind(f).to(n.targetClass), u.onActivation((S, l) => {
          var d, b;
          return l[g] || (l[g] = !0, (d = l[a.Initializer]) == null || d.call(l)), (b = n.onCreate) == null || b.call(n, l), l;
        });
      }
    }
    for (let n of i)
      e.get(n.targetClass.name);
  }
  s(O, "load"), a.load = O;
  function C(t = "") {
    const e = p.get(t);
    e && (e.unbindAll(), p.delete(t));
  }
  s(C, "unload"), a.unload = C;
  function M(t, e) {
    const o = m(e).get(t.name);
    if (!o)
      throw new Error(`Unable to find instance of class ${t.name}`);
    return o;
  }
  s(M, "getInstance"), a.getInstance = M;
  async function N(t) {
    const e = t(), o = [];
    for (let i in e) {
      const n = e[i];
      if (typeof n == "function") {
        const r = n();
        r instanceof Promise && o.push(r);
      } else
        n instanceof Promise && o.push(n);
    }
    await Promise.all(o);
  }
  s(N, "importAll"), a.importAll = N;
})(h || (h = {}));
export {
  h as IoC
};
