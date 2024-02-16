var C = Object.defineProperty;
var c = (o, e) => C(o, "name", { value: e, configurable: !0 });
import { IoC as m } from "ioc";
import { getCurrentInstance as T, defineComponent as W, watchEffect as A, watch as R, onServerPrefetch as L, onRenderTriggered as $, onRenderTracked as H, onErrorCaptured as K, onDeactivated as V, onActivated as q, onUpdated as J, onBeforeUnmount as Q, onBeforeMount as X, onUnmounted as Y, onMounted as Z, inject as _, shallowRef as F, ref as x, shallowReadonly as z, readonly as ee, computed as P } from "vue";
import { onBeforeRouteUpdate as te, onBeforeRouteLeave as re } from "vue-router";
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
c(g, "VueComponent"), g.__test__ = !1, g.defineProps = [];
let M = g;
function ce(o) {
  return W(
    () => {
      const e = m.getInstance(o, v);
      return E(o, e), e.render.bind(e);
    },
    {
      name: o.name,
      props: o.defineProps
      // emits: componentClass.defineEmits as any,
    }
  );
}
c(ce, "toNative");
const u = class u {
  constructor(e, t) {
    this.el = e, this.name = t;
  }
  static install(e) {
    const t = G().filter((r) => r[1].isDirective).map((r) => [r[1].directiveName, r]);
    u._directiveNameMapVueDirective = new Map(t);
    for (let r of t) {
      const a = r[1][1].directiveName, s = r[1][0];
      e.directive(a, {
        created(n, i) {
          u.getInstance(n, a, s).created(i);
        },
        mounted(n, i) {
          const b = u.getInstance(n, a, s);
          b.mounted(i), b.mountedAndUpdated(i);
        },
        updated(n, i) {
          const b = u.getInstance(n, a, s);
          b.updated(i), b.mountedAndUpdated(i);
        },
        beforeUnmount(n, i) {
          u.getInstance(n, a, s).beforeUnmount(
            i
          );
        },
        beforeUpdate(n, i) {
          u.getInstance(n, a, s).beforeUpdate(
            i
          );
        },
        beforeMount(n, i) {
          u.getInstance(n, a, s).beforeMount(
            i
          );
        },
        unmounted(n, i) {
          u.getInstance(n, a, s).unmounted(i);
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
    const t = u._elMapVueDirective.get(this.el);
    t && (t.delete(this.name), t.size || u._elMapVueDirective.delete(this.el));
  }
};
c(u, "VueDirective"), u._elMapVueDirective = /* @__PURE__ */ new Map(), u._directiveNameMapVueDirective = /* @__PURE__ */ new Map();
let w = u;
const D = class D {
  constructor() {
    this.isComponent = !1, this.isService = !1, this.isDirective = !1, this.isRouterGuard = !1, this.directiveName = "", this.mutts = [], this.readonlys = [], this.links = [], this.vueInject = [], this.bindThis = [], this.hooks = [], this.watchers = [], this.propsWatchers = [], this.computers = [];
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
        R(a, r, t.option);
      }
    }
  }
  handlePropsWatchers(e) {
    for (let t of this.propsWatchers) {
      let r = e[t.methodName];
      if (typeof r != "function")
        throw new Error("Decorator PropsWatcher can only be used on methods");
      r = r.bind(e), R(e.props, r, t.option);
    }
  }
  handleHook(e) {
    for (let t of this.hooks) {
      let r = e[t.methodName];
      if (typeof r != "function")
        throw new Error("Decorator Hook can only be used for methods");
      switch (r = r.bind(e), t.type) {
        case "onMounted":
          Z(r);
          break;
        case "onUnmounted":
          Y(r);
          break;
        case "onBeforeMount":
          X(r);
          break;
        case "onBeforeUnmount":
          Q(r);
          break;
        case "onUpdated":
          J(r);
          break;
        case "onActivated":
          q(r);
          break;
        case "onDeactivated":
          V(r);
          break;
        case "onErrorCaptured":
          K(r);
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
          re(r);
          break;
        case "onBeforeRouteUpdate":
          te(r);
          break;
        default:
          throw new Error("Unknown Hook Type " + t.type);
      }
    }
  }
  handleVueInject(e) {
    for (let t of this.vueInject) {
      const r = _(t.provideKey);
      Object.defineProperty(e, t.propName, {
        configurable: !0,
        enumerable: !0,
        get: () => r
      });
    }
  }
  handleMut(e) {
    for (let t of this.mutts) {
      const r = e[t.propName], a = t.shallow ? F(r) : x(r);
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
      const r = e[t.propName], a = t.shallow ? z(r) : ee(r);
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
        const n = s.bind(e), i = P(n);
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
        const i = P(() => n.call(e));
        e[Symbol.for(a)] = i, Object.defineProperty(e, a, {
          configurable: !0,
          get: () => i.value
        });
      }
    }
  }
};
c(D, "Metadata");
let N = D;
const y = /* @__PURE__ */ new Map();
function G() {
  return Array.from(y.entries());
}
c(G, "getAllMetadata");
function oe(o) {
  const e = y.get(o);
  if (!e)
    throw new Error("Unable to find corresponding Metadata instance");
  return e;
}
c(oe, "getMetadata");
const O = Symbol("__appliedMetadata__");
function E(o, e) {
  if (e[O])
    return;
  e[O] = !0;
  const t = oe(o);
  t.handleMut(e), t.handleReadonly(e), t.handleVueInject(e), t.handleComputer(e), t.handleWatchers(e), t.handleBindThis(e), e instanceof M && (t.handleLink(e), t.handleHook(e), t.handlePropsWatchers(e));
}
c(E, "applyMetadata");
function d(o, e) {
  if (!e || typeof e == "string") {
    typeof o == "object" && (o = o.constructor);
    let t = y.get(o);
    return t || y.set(o, t = new N()), t;
  } else {
    let t = e.metadata.metadata;
    return t || (t = e.metadata.metadata = new N()), e.kind === "class" && y.set(o, t), t;
  }
}
c(d, "getOrCreateMetadata");
function ue() {
  const o = m.Injectable({ moduleName: v });
  return (e, t) => {
    o(e, t), d(e, t).isComponent = !0;
  };
}
c(ue, "Component");
function de(o) {
  const e = m.Injectable(
    Object.assign(
      {
        moduleName: v,
        onCreate: (t) => E(t.constructor, t)
      },
      o
    )
  );
  return (t, r) => {
    e(t, r), d(t, r).isService = !0;
  };
}
c(de, "Service");
function fe(o) {
  const e = m.Injectable(
    Object.assign(
      {
        moduleName: v,
        singleton: !0,
        onCreate: (t) => E(t.constructor, t)
      },
      o
    )
  );
  return (t, r) => {
    e(t, r);
    const a = d(t, r);
    a.isRouterGuard = !0, a.routerGuardMatchTo = o == null ? void 0 : o.matchTo, a.routerGuardMatchFrom = o == null ? void 0 : o.matchFrom;
  };
}
c(fe, "RouterGuard");
function le(o) {
  const e = m.Injectable({ moduleName: v });
  return (t, r) => {
    e(t, r);
    const a = d(t, r);
    a.isDirective = !0, o || (o = t.name.replace(/Directive$/, ""), o = o[0].toLowerCase() + o.slice(1)), a.directiveName = o;
  };
}
c(le, "Directive");
function he(o) {
  return (e, t) => {
    d(e, t).mutts.push({ propName: h(t), shallow: o });
  };
}
c(he, "Mut");
function pe(o) {
  return (e, t) => {
    d(e, t).readonlys.push({ propName: h(t), shallow: o });
  };
}
c(pe, "Readonly");
function me(o) {
  return (e, t) => {
    d(e, t).links.push({
      propName: h(t),
      refName: o == null ? void 0 : o.refName,
      isDirective: !!(o != null && o.isDirective || o != null && o.directiveName),
      directiveName: o == null ? void 0 : o.directiveName
    });
  };
}
c(me, "Link");
function be(o) {
  return (e, t) => {
    d(e, t).vueInject.push({
      propName: h(t),
      provideKey: o
    });
  };
}
c(be, "VueInject");
function ve() {
  return (o, e) => {
    d(o, e).computers.push(h(e));
  };
}
c(ve, "Computed");
function ge(o) {
  return (e, t) => {
    d(e, t).hooks.push({
      methodName: h(t),
      type: o
    });
  };
}
c(ge, "Hook");
function ye(o) {
  return (e, t) => {
    d(e, t).propsWatchers.push({
      methodName: h(t),
      option: o
    });
  };
}
c(ye, "PropsWatcher");
function we(o) {
  return (e, t) => {
    d(e, t).watchers.push({
      methodName: h(t),
      ...o
    });
  };
}
c(we, "Watcher");
function Ne() {
  return (o, e) => {
    d(o, e).bindThis.push(h(e));
  };
}
c(Ne, "BindThis");
function h(o) {
  return typeof o == "string" ? o : o.name;
}
c(h, "getName");
const j = class j {
  static install(e) {
    const t = G().filter((a) => a[1].isRouterGuard);
    for (let a of t) {
      const s = I.getInstance(a[0]), n = a[1], i = s.beforeEach.bind(s), b = s.afterEach.bind(s), S = s.beforeResolve.bind(s), B = s.onError.bind(s);
      e.onError((l, f, p) => {
        r(
          f,
          p,
          n.routerGuardMatchTo,
          n.routerGuardMatchFrom
        ) && B(l, f, p);
      }), e.beforeEach(async (l, f, p) => {
        r(
          l,
          f,
          n.routerGuardMatchTo,
          n.routerGuardMatchFrom
        ) ? await i(l, f, p) : p();
      }), e.afterEach(async (l, f) => {
        r(
          l,
          f,
          n.routerGuardMatchTo,
          n.routerGuardMatchFrom
        ) && await b(l, f);
      }), e.beforeResolve(async (l, f, p) => {
        r(
          l,
          f,
          n.routerGuardMatchTo,
          n.routerGuardMatchFrom
        ) ? await S(l, f, p) : p();
      });
    }
    function r(a, s, n, i) {
      return !i && !n ? !0 : n && i ? i.test(s.path) && n.test(a.path) : (n == null ? void 0 : n.test(a.path)) || (i == null ? void 0 : i.test(s.path));
    }
    c(r, "match");
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
c(j, "VueRouterGuard");
let k = j;
const U = class U {
  static getInstance(e) {
    return m.getInstance(e, v);
  }
  static async install(e, t, r) {
    await m.importAll(() => r), m.load(v), w.install(e), k.install(t);
  }
};
c(U, "VueClass");
let I = U;
export {
  Ne as BindThis,
  ue as Component,
  ve as Computed,
  le as Directive,
  ge as Hook,
  me as Link,
  N as Metadata,
  v as ModuleName,
  he as Mut,
  ye as PropsWatcher,
  pe as Readonly,
  fe as RouterGuard,
  de as Service,
  I as VueClass,
  M as VueComponent,
  w as VueDirective,
  be as VueInject,
  k as VueRouterGuard,
  we as Watcher,
  E as applyMetadata,
  G as getAllMetadata,
  oe as getMetadata,
  d as getOrCreateMetadata,
  ce as toNative
};
