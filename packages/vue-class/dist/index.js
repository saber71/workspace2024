var C = Object.defineProperty;
var d = (o, e) => C(o, "name", { value: e, configurable: !0 });
import { IoC as m } from "ioc";
import { getCurrentInstance as T, defineComponent as W, watchEffect as A, watch as P, onServerPrefetch as L, onRenderTriggered as $, onRenderTracked as H, onErrorCaptured as q, onDeactivated as J, onActivated as K, onUpdated as Q, onBeforeUnmount as X, onBeforeMount as Y, onUnmounted as Z, onMounted as _, shallowRef as F, ref as V, shallowReadonly as x, readonly as z, computed as j } from "vue";
import { onBeforeRouteUpdate as ee, onBeforeRouteLeave as te } from "vue-router";
const v = "vue-class", g = class g {
  constructor() {
    let e = T();
    if (!e)
      if (g.__test__)
        e = { appContext: {} };
      else
        throw new Error("Cannot directly create VueComponent instance");
    this.vueInstance = e, this.context = e.appContext;
  }
  get props() {
    return this.vueInstance.props;
  }
  render() {
  }
};
d(g, "VueComponent"), g.__test__ = !1, g.defineProps = [];
let M = g;
function ie(o) {
  return W(
    () => {
      const e = m.getInstance(o, v);
      return I(o, e), e.render.bind(e);
    },
    {
      name: o.name,
      props: o.defineProps
      // emits: componentClass.defineEmits as any,
    }
  );
}
d(ie, "toNative");
const c = class c {
  constructor(e, t) {
    this.el = e, this.name = t;
  }
  static install(e) {
    const t = O().filter((r) => r[1].isDirective).map((r) => [r[1].directiveName, r]);
    c._directiveNameMapVueDirective = new Map(t);
    for (let r of t) {
      const a = r[1][1].directiveName, s = r[1][0];
      e.directive(a, {
        created(n, i) {
          c.getInstance(n, a, s).created(i);
        },
        mounted(n, i) {
          const b = c.getInstance(n, a, s);
          b.mounted(i), b.mountedAndUpdated(i);
        },
        updated(n, i) {
          const b = c.getInstance(n, a, s);
          b.updated(i), b.mountedAndUpdated(i);
        },
        beforeUnmount(n, i) {
          c.getInstance(n, a, s).beforeUnmount(
            i
          );
        },
        beforeUpdate(n, i) {
          c.getInstance(n, a, s).beforeUpdate(
            i
          );
        },
        beforeMount(n, i) {
          c.getInstance(n, a, s).beforeMount(
            i
          );
        },
        unmounted(n, i) {
          c.getInstance(n, a, s).unmounted(i);
        }
      });
    }
  }
  static getInstance(e, t, r) {
    if (!r && (r = this._directiveNameMapVueDirective.get(t), !r))
      throw new Error(
        "Unable to find the VueDirective class corresponding to the directive name"
      );
    let a = this._elMapVueDirective.get(e);
    a || this._elMapVueDirective.set(e, a = /* @__PURE__ */ new Map());
    let s = a.get(t);
    return s || a.set(t, s = new r(e, t)), s;
  }
  mountedAndUpdated(e) {
  }
  created(e) {
  }
  beforeMount(e) {
  }
  mounted(e) {
  }
  beforeUpdate(e) {
  }
  updated(e) {
  }
  beforeUnmount(e) {
  }
  unmounted(e) {
    const t = c._elMapVueDirective.get(this.el);
    t && (t.delete(this.name), t.size || c._elMapVueDirective.delete(this.el));
  }
};
d(c, "VueDirective"), c._elMapVueDirective = /* @__PURE__ */ new Map(), c._directiveNameMapVueDirective = /* @__PURE__ */ new Map();
let w = c;
const D = class D {
  constructor() {
    this.isComponent = !1, this.isService = !1, this.isDirective = !1, this.isRouterGuard = !1, this.directiveName = "", this.mutts = [], this.readonlys = [], this.links = [], this.bindThis = [], this.hooks = [], this.watchers = [], this.propsWatchers = [], this.computers = [];
  }
  handleBindThis(e) {
    for (let t of this.bindThis) {
      const r = e[t];
      e[t] = r.bind(e);
    }
  }
  handleWatchers(e) {
    for (let t of this.watchers) {
      let r = e[t.methodName];
      if (typeof r != "function")
        throw new Error("Decorator Watcher can only be used on methods");
      if (r = r.bind(e), !t.source)
        A(r, t.option);
      else {
        t.source instanceof Array || (t.source = [t.source]);
        const a = t.source.map((s) => typeof s == "string" ? e[Symbol.for(s)] ?? (() => e[s]) : () => s(e));
        P(a, r, t.option);
      }
    }
  }
  handlePropsWatchers(e) {
    for (let t of this.propsWatchers) {
      let r = e[t.methodName];
      if (typeof r != "function")
        throw new Error("Decorator PropsWatcher can only be used on methods");
      r = r.bind(e), P(e.props, r, t.option);
    }
  }
  handleHook(e) {
    for (let t of this.hooks) {
      let r = e[t.methodName];
      if (typeof r != "function")
        throw new Error("Decorator Hook can only be used for methods");
      switch (r = r.bind(e), t.type) {
        case "onMounted":
          _(r);
          break;
        case "onUnmounted":
          Z(r);
          break;
        case "onBeforeMount":
          Y(r);
          break;
        case "onBeforeUnmount":
          X(r);
          break;
        case "onUpdated":
          Q(r);
          break;
        case "onActivated":
          K(r);
          break;
        case "onDeactivated":
          J(r);
          break;
        case "onErrorCaptured":
          q(r);
          break;
        case "onRenderTracked":
          H(r);
          break;
        case "onRenderTriggered":
          $(r);
          break;
        case "onServerPrefetch":
          L(r);
          break;
        case "onBeforeRouteLeave":
          te(r);
          break;
        case "onBeforeRouteUpdate":
          ee(r);
          break;
        default:
          throw new Error("Unknown Hook Type " + t.type);
      }
    }
  }
  handleMut(e) {
    for (let t of this.mutts) {
      const r = e[t.propName], a = t.shallow ? F(r) : V(r);
      e[Symbol.for(t.propName)] = a, Object.defineProperty(e, t.propName, {
        configurable: !0,
        enumerable: !0,
        set(s) {
          a.value = s;
        },
        get() {
          return a.value;
        }
      });
    }
  }
  handleReadonly(e) {
    for (let t of this.readonlys) {
      const r = e[t.propName], a = t.shallow ? x(r) : z(r);
      e[Symbol.for(t.propName)] = a, Object.defineProperty(e, t.propName, {
        configurable: !0,
        enumerable: !0,
        get() {
          return a;
        }
      });
    }
  }
  handleLink(e) {
    for (let t of this.links) {
      let r = t.propName, a = "";
      t.refName ? r = t.refName : t.isDirective && (r = r.replace(/Directive$/, "")), t.isDirective && (a = t.directiveName ?? "", a || (a = r)), Object.defineProperty(e, t.propName, {
        configurable: !0,
        enumerable: !0,
        get() {
          var n;
          const s = (n = e.vueInstance.refs) == null ? void 0 : n[r];
          if (t.isDirective) {
            if (!s)
              throw new Error("There is no ref named " + r);
            return w.getInstance(s, a);
          }
          return s;
        }
      });
    }
  }
  handleComputer(e) {
    var r;
    if (!this.computers.length)
      return;
    const t = Object.getPrototypeOf(e);
    for (let a of this.computers) {
      const s = e[a];
      if (typeof s == "function") {
        const n = s.bind(e), i = j(n);
        e[Symbol.for(a)] = i, e[a] = () => i.value;
      } else {
        const n = (r = Object.getOwnPropertyDescriptor(
          t,
          a
        )) == null ? void 0 : r.get;
        if (!n)
          throw new Error(
            "Computer can only be used on getters or no parameter methods"
          );
        const i = j(() => n.call(e));
        e[Symbol.for(a)] = i, Object.defineProperty(e, a, {
          configurable: !0,
          get: () => i.value
        });
      }
    }
  }
};
d(D, "Metadata");
let N = D;
const y = /* @__PURE__ */ new Map();
function O() {
  return Array.from(y.entries());
}
d(O, "getAllMetadata");
function re(o) {
  const e = y.get(o);
  if (!e)
    throw new Error("Unable to find corresponding Metadata instance");
  return e;
}
d(re, "getMetadata");
const G = Symbol("__appliedMetadata__");
function I(o, e) {
  if (e[G])
    return;
  e[G] = !0;
  const t = re(o);
  t.handleMut(e), t.handleReadonly(e), t.handleComputer(e), t.handleWatchers(e), t.handleBindThis(e), e instanceof M && (t.handleLink(e), t.handleHook(e), t.handlePropsWatchers(e));
}
d(I, "applyMetadata");
function u(o, e) {
  if (!e || typeof e == "string") {
    typeof o == "object" && (o = o.constructor);
    let t = y.get(o);
    return t || y.set(o, t = new N()), t;
  } else {
    let t = e.metadata.metadata;
    return t || (t = e.metadata.metadata = new N()), e.kind === "class" && y.set(o, t), t;
  }
}
d(u, "getOrCreateMetadata");
function de() {
  const o = m.Injectable({ moduleName: v });
  return (e, t) => {
    o(e, t), u(e, t).isComponent = !0;
  };
}
d(de, "Component");
function ce(o) {
  const e = m.Injectable(
    Object.assign(
      {
        moduleName: v,
        onCreate: (t) => I(t.constructor, t)
      },
      o
    )
  );
  return (t, r) => {
    e(t, r), u(t, r).isService = !0;
  };
}
d(ce, "Service");
function ue(o) {
  const e = m.Injectable(
    Object.assign(
      {
        moduleName: v,
        singleton: !0,
        onCreate: (t) => I(t.constructor, t)
      },
      o
    )
  );
  return (t, r) => {
    e(t, r);
    const a = u(t, r);
    a.isRouterGuard = !0, a.routerGuardMatchTo = o == null ? void 0 : o.matchTo, a.routerGuardMatchFrom = o == null ? void 0 : o.matchFrom;
  };
}
d(ue, "RouterGuard");
function fe(o) {
  const e = m.Injectable({ moduleName: v });
  return (t, r) => {
    e(t, r);
    const a = u(t, r);
    a.isDirective = !0, o || (o = t.name.replace(/Directive$/, ""), o = o[0].toLowerCase() + o.slice(1)), a.directiveName = o;
  };
}
d(fe, "Directive");
function le(o) {
  return (e, t) => {
    u(e, t).mutts.push({ propName: p(t), shallow: o });
  };
}
d(le, "Mut");
function he(o) {
  return (e, t) => {
    u(e, t).readonlys.push({ propName: p(t), shallow: o });
  };
}
d(he, "Readonly");
function me(o) {
  return (e, t) => {
    u(e, t).links.push({
      propName: p(t),
      refName: o == null ? void 0 : o.refName,
      isDirective: !!(o != null && o.isDirective || o != null && o.directiveName),
      directiveName: o == null ? void 0 : o.directiveName
    });
  };
}
d(me, "Link");
function pe() {
  return (o, e) => {
    u(o, e).computers.push(p(e));
  };
}
d(pe, "Computed");
function be(o) {
  return (e, t) => {
    u(e, t).hooks.push({
      methodName: p(t),
      type: o
    });
  };
}
d(be, "Hook");
function ve(o) {
  return (e, t) => {
    u(e, t).propsWatchers.push({
      methodName: p(t),
      option: o
    });
  };
}
d(ve, "PropsWatcher");
function ge(o) {
  return (e, t) => {
    u(e, t).watchers.push({
      methodName: p(t),
      ...o
    });
  };
}
d(ge, "Watcher");
function ye() {
  return (o, e) => {
    u(o, e).bindThis.push(p(e));
  };
}
d(ye, "BindThis");
function p(o) {
  return typeof o == "string" ? o : o.name;
}
d(p, "getName");
const U = class U {
  static install(e) {
    const t = O().filter((a) => a[1].isRouterGuard);
    for (let a of t) {
      const s = E.getInstance(a[0]), n = a[1], i = s.beforeEach.bind(s), b = s.afterEach.bind(s), S = s.beforeResolve.bind(s), B = s.onError.bind(s);
      e.onError((l, f, h) => {
        r(
          f,
          h,
          n.routerGuardMatchTo,
          n.routerGuardMatchFrom
        ) && B(l, f, h);
      }), e.beforeEach(async (l, f, h) => {
        r(
          l,
          f,
          n.routerGuardMatchTo,
          n.routerGuardMatchFrom
        ) ? await i(l, f, h) : h();
      }), e.afterEach(async (l, f) => {
        r(
          l,
          f,
          n.routerGuardMatchTo,
          n.routerGuardMatchFrom
        ) && await b(l, f);
      }), e.beforeResolve(async (l, f, h) => {
        r(
          l,
          f,
          n.routerGuardMatchTo,
          n.routerGuardMatchFrom
        ) ? await S(l, f, h) : h();
      });
    }
    function r(a, s, n, i) {
      return !i && !n ? !0 : n && i ? i.test(s.path) && n.test(a.path) : (n == null ? void 0 : n.test(a.path)) || (i == null ? void 0 : i.test(s.path));
    }
    d(r, "match");
  }
  beforeEach(e, t, r) {
    r();
  }
  beforeResolve(e, t, r) {
    r();
  }
  afterEach(e, t) {
  }
  onError(e, t, r) {
  }
};
d(U, "VueRouterGuard");
let k = U;
const R = class R {
  static getInstance(e) {
    return m.getInstance(e, v);
  }
  static async install(e, t, r) {
    await m.importAll(() => r), m.load(v), w.install(e), k.install(t);
  }
};
d(R, "VueClass");
let E = R;
export {
  ye as BindThis,
  de as Component,
  pe as Computed,
  fe as Directive,
  be as Hook,
  me as Link,
  N as Metadata,
  v as ModuleName,
  le as Mut,
  ve as PropsWatcher,
  he as Readonly,
  ue as RouterGuard,
  ce as Service,
  E as VueClass,
  M as VueComponent,
  w as VueDirective,
  k as VueRouterGuard,
  ge as Watcher,
  I as applyMetadata,
  O as getAllMetadata,
  re as getMetadata,
  u as getOrCreateMetadata,
  ie as toNative
};
