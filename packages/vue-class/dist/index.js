var C = Object.defineProperty;
var c = (o, e) => C(o, "name", { value: e, configurable: !0 });
import { IoC as m } from "ioc";
import { getCurrentInstance as T, defineComponent as W, watchEffect as A, watch as R, onServerPrefetch as L, onRenderTriggered as $, onRenderTracked as H, onErrorCaptured as K, onDeactivated as V, onActivated as q, onUpdated as J, onBeforeUnmount as Q, onBeforeMount as X, onUnmounted as Y, onMounted as Z, inject as _, provide as F, shallowRef as x, ref as z, shallowReadonly as ee, readonly as te, computed as P } from "vue";
import { onBeforeRouteUpdate as re, onBeforeRouteLeave as oe } from "vue-router";
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
function de(o) {
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
c(de, "toNative");
const d = class d {
  constructor(e, t) {
    this.el = e, this.name = t;
  }
  static install(e) {
    const t = G().filter((r) => r[1].isDirective).map((r) => [r[1].directiveName, r]);
    d._directiveNameMapVueDirective = new Map(t);
    for (let r of t) {
      const a = r[1][1].directiveName, s = r[1][0];
      e.directive(a, {
        created(n, i) {
          d.getInstance(n, a, s).created(i);
        },
        mounted(n, i) {
          const b = d.getInstance(n, a, s);
          b.mounted(i), b.mountedAndUpdated(i);
        },
        updated(n, i) {
          const b = d.getInstance(n, a, s);
          b.updated(i), b.mountedAndUpdated(i);
        },
        beforeUnmount(n, i) {
          d.getInstance(n, a, s).beforeUnmount(
            i
          );
        },
        beforeUpdate(n, i) {
          d.getInstance(n, a, s).beforeUpdate(
            i
          );
        },
        beforeMount(n, i) {
          d.getInstance(n, a, s).beforeMount(
            i
          );
        },
        unmounted(n, i) {
          d.getInstance(n, a, s).unmounted(i);
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
    const t = d._elMapVueDirective.get(this.el);
    t && (t.delete(this.name), t.size || d._elMapVueDirective.delete(this.el));
  }
};
c(d, "VueDirective"), d._elMapVueDirective = /* @__PURE__ */ new Map(), d._directiveNameMapVueDirective = /* @__PURE__ */ new Map();
let w = d;
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
          oe(r);
          break;
        case "onBeforeRouteUpdate":
          re(r);
          break;
        default:
          throw new Error("Unknown Hook Type " + t.type);
      }
    }
  }
  handleVueInject(e) {
    for (let t of this.vueInject)
      Object.defineProperty(e, t.propName, {
        configurable: !0,
        enumerable: !0,
        get: () => _(t.provideKey),
        set: (r) => F(t.provideKey, r)
      });
  }
  handleMut(e) {
    for (let t of this.mutts) {
      const r = e[t.propName], a = t.shallow ? x(r) : z(r);
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
      const r = e[t.propName], a = t.shallow ? ee(r) : te(r);
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
function ae(o) {
  const e = y.get(o);
  if (!e)
    throw new Error("Unable to find corresponding Metadata instance");
  return e;
}
c(ae, "getMetadata");
const O = Symbol("__appliedMetadata__");
function E(o, e) {
  if (e[O])
    return;
  e[O] = !0;
  const t = ae(o);
  t.handleMut(e), t.handleReadonly(e), t.handleVueInject(e), t.handleComputer(e), t.handleWatchers(e), t.handleBindThis(e), e instanceof M && (t.handleLink(e), t.handleHook(e), t.handlePropsWatchers(e));
}
c(E, "applyMetadata");
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
c(u, "getOrCreateMetadata");
function ue() {
  const o = m.Injectable({ moduleName: v });
  return (e, t) => {
    o(e, t), u(e, t).isComponent = !0;
  };
}
c(ue, "Component");
function fe(o) {
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
    e(t, r), u(t, r).isService = !0;
  };
}
c(fe, "Service");
function le(o) {
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
    const a = u(t, r);
    a.isRouterGuard = !0, a.routerGuardMatchTo = o == null ? void 0 : o.matchTo, a.routerGuardMatchFrom = o == null ? void 0 : o.matchFrom;
  };
}
c(le, "RouterGuard");
function he(o) {
  const e = m.Injectable({ moduleName: v });
  return (t, r) => {
    e(t, r);
    const a = u(t, r);
    a.isDirective = !0, o || (o = t.name.replace(/Directive$/, ""), o = o[0].toLowerCase() + o.slice(1)), a.directiveName = o;
  };
}
c(he, "Directive");
function pe(o) {
  return (e, t) => {
    u(e, t).mutts.push({ propName: h(t), shallow: o });
  };
}
c(pe, "Mut");
function me(o) {
  return (e, t) => {
    u(e, t).readonlys.push({ propName: h(t), shallow: o });
  };
}
c(me, "Readonly");
function be(o) {
  return (e, t) => {
    u(e, t).links.push({
      propName: h(t),
      refName: o == null ? void 0 : o.refName,
      isDirective: !!(o != null && o.isDirective || o != null && o.directiveName),
      directiveName: o == null ? void 0 : o.directiveName
    });
  };
}
c(be, "Link");
function ve(o) {
  return (e, t) => {
    u(e, t).vueInject.push({
      propName: h(t),
      provideKey: o
    });
  };
}
c(ve, "VueInject");
function ge() {
  return (o, e) => {
    u(o, e).computers.push(h(e));
  };
}
c(ge, "Computed");
function ye(o) {
  return (e, t) => {
    u(e, t).hooks.push({
      methodName: h(t),
      type: o
    });
  };
}
c(ye, "Hook");
function we(o) {
  return (e, t) => {
    u(e, t).propsWatchers.push({
      methodName: h(t),
      option: o
    });
  };
}
c(we, "PropsWatcher");
function Ne(o) {
  return (e, t) => {
    u(e, t).watchers.push({
      methodName: h(t),
      ...o
    });
  };
}
c(Ne, "Watcher");
function Me() {
  return (o, e) => {
    u(o, e).bindThis.push(h(e));
  };
}
c(Me, "BindThis");
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
  Me as BindThis,
  ue as Component,
  ge as Computed,
  he as Directive,
  ye as Hook,
  be as Link,
  N as Metadata,
  v as ModuleName,
  pe as Mut,
  we as PropsWatcher,
  me as Readonly,
  le as RouterGuard,
  fe as Service,
  I as VueClass,
  M as VueComponent,
  w as VueDirective,
  ve as VueInject,
  k as VueRouterGuard,
  Ne as Watcher,
  E as applyMetadata,
  G as getAllMetadata,
  ae as getMetadata,
  u as getOrCreateMetadata,
  de as toNative
};
