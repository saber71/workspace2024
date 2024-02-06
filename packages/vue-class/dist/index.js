var I = Object.defineProperty;
var n = (r, e) => I(r, "name", { value: e, configurable: !0 });
import { IoC as p } from "ioc";
import { getCurrentInstance as M, defineComponent as O, watchEffect as T, watch as k, onServerPrefetch as W, onRenderTriggered as j, onRenderTracked as C, onErrorCaptured as E, onDeactivated as R, onActivated as S, onUpdated as U, onBeforeUnmount as B, onBeforeMount as D, onUnmounted as H, onMounted as x, shallowRef as $, ref as A, shallowReadonly as L, readonly as _, computed as w } from "vue";
const i = "vue-class", d = class d {
  constructor() {
    let e = M();
    if (!e)
      if (d.__test__)
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
n(d, "VueComponent"), d.__test__ = !1, d.defineProps = [];
let l = d;
function K(r) {
  return O(
    () => {
      const e = p.getInstance(r, i);
      return P(r, e), e.render.bind(e);
    },
    {
      name: r.name,
      props: r.defineProps
      // emits: componentClass.defineEmits as any,
    }
  );
}
n(K, "toNative");
const y = class y {
  constructor() {
    this.mutts = [], this.readonlys = [], this.links = [], this.bindThis = [], this.hooks = [], this.watchers = [], this.propsWatchers = [], this.computers = [];
  }
  handleBindThis(e) {
    for (let t of this.bindThis) {
      const o = e[t];
      e[t] = o.bind(e);
    }
  }
  handleWatchers(e) {
    for (let t of this.watchers) {
      let o = e[t.methodName];
      if (typeof o != "function")
        throw new Error("Decorator Watcher can only be used on methods");
      if (o = o.bind(e), !t.source)
        T(o, t.option);
      else {
        t.source instanceof Array || (t.source = [t.source]);
        const a = t.source.map((u) => typeof u == "string" ? e[Symbol.for(u)] ?? (() => e[u]) : () => u(e));
        k(a, o, t.option);
      }
    }
  }
  handlePropsWatchers(e) {
    for (let t of this.propsWatchers) {
      let o = e[t.methodName];
      if (typeof o != "function")
        throw new Error("Decorator PropsWatcher can only be used on methods");
      o = o.bind(e), k(e.props, o, t.option);
    }
  }
  handleHook(e) {
    for (let t of this.hooks) {
      let o = e[t.methodName];
      if (typeof o != "function")
        throw new Error("Decorator Hook can only be used for methods");
      switch (o = o.bind(e), t.type) {
        case "onMounted":
          x(o);
          break;
        case "onUnmounted":
          H(o);
          break;
        case "onBeforeMount":
          D(o);
          break;
        case "onBeforeUnmount":
          B(o);
          break;
        case "onUpdated":
          U(o);
          break;
        case "onActivated":
          S(o);
          break;
        case "onDeactivated":
          R(o);
          break;
        case "onErrorCaptured":
          E(o);
          break;
        case "onRenderTracked":
          C(o);
          break;
        case "onRenderTriggered":
          j(o);
          break;
        case "onServerPrefetch":
          W(o);
          break;
        default:
          throw new Error("Unknown Hook Type " + t.type);
      }
    }
  }
  handleMut(e) {
    for (let t of this.mutts) {
      const o = e[t.propName], a = t.shallow ? $(o) : A(o);
      e[Symbol.for(t.propName)] = a, Object.defineProperty(e, t.propName, {
        configurable: !0,
        enumerable: !0,
        set(u) {
          a.value = u;
        },
        get() {
          return a.value;
        }
      });
    }
  }
  handleReadonly(e) {
    for (let t of this.readonlys) {
      const o = e[t.propName], a = t.shallow ? L(o) : _(o);
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
    for (let t of this.links)
      Object.defineProperty(e, t, {
        configurable: !0,
        enumerable: !0,
        get() {
          var o;
          return (o = e.vueInstance.refs) == null ? void 0 : o[t];
        }
      });
  }
  handleComputer(e) {
    var o;
    if (!this.computers.length)
      return;
    const t = Object.getPrototypeOf(e);
    for (let a of this.computers) {
      const u = e[a];
      if (typeof u == "function") {
        const f = u.bind(e), h = w(f);
        e[Symbol.for(a)] = h, e[a] = () => h.value;
      } else {
        const f = (o = Object.getOwnPropertyDescriptor(
          t,
          a
        )) == null ? void 0 : o.get;
        if (!f)
          throw new Error(
            "Computer can only be used on getters or no parameter methods"
          );
        const h = w(() => f.call(e));
        e[Symbol.for(a)] = h, Object.defineProperty(e, a, {
          configurable: !0,
          get: () => h.value
        });
      }
    }
  }
};
n(y, "Metadata");
let m = y;
const b = /* @__PURE__ */ new Map();
function q(r) {
  const e = b.get(r);
  if (!e)
    throw new Error("Unable to find corresponding Metadata instance");
  return e;
}
n(q, "getMetadata");
const N = Symbol();
function P(r, e) {
  if (e[N])
    return;
  e[N] = !0;
  const t = q(r);
  t.handleMut(e), t.handleReadonly(e), t.handleComputer(e), t.handleWatchers(e), t.handleBindThis(e), e instanceof l && (t.handleLink(e), t.handleHook(e), t.handlePropsWatchers(e));
}
n(P, "applyMetadata");
function s(r) {
  typeof r == "object" && (r = r.constructor);
  let e = b.get(r);
  return e || b.set(r, e = new m()), e;
}
n(s, "getOrCreateMetadata");
function Q() {
  const r = p.Injectable({ moduleName: i });
  return (e, t) => {
    r(e, t), s(e);
  };
}
n(Q, "Component");
function X(r) {
  const e = p.Injectable(
    Object.assign(
      {
        moduleName: i,
        onCreate: (t) => P(t.constructor, t)
      },
      r
    )
  );
  return (t, o) => {
    e(t, o), s(t);
  };
}
n(X, "Service");
function Y(r) {
  return (e, t) => {
    s(e).mutts.push({ propName: c(t), shallow: r });
  };
}
n(Y, "Mut");
function Z(r) {
  return (e, t) => {
    s(e).readonlys.push({ propName: c(t), shallow: r });
  };
}
n(Z, "Readonly");
function V() {
  return (r, e) => {
    s(r).links.push(c(e));
  };
}
n(V, "Link");
function z() {
  return (r, e) => {
    s(r).computers.push(c(e));
  };
}
n(z, "Computed");
function ee(r) {
  return (e, t) => {
    s(e).hooks.push({
      methodName: c(t),
      type: r
    });
  };
}
n(ee, "Hook");
function te(r) {
  return (e, t) => {
    s(e).propsWatchers.push({
      methodName: c(t),
      option: r
    });
  };
}
n(te, "PropsWatcher");
function oe(r) {
  return (e, t) => {
    s(e).watchers.push({
      methodName: c(t),
      ...r
    });
  };
}
n(oe, "Watcher");
function re() {
  return (r, e) => {
    s(r).bindThis.push(c(e));
  };
}
n(re, "BindThis");
function c(r) {
  return typeof r == "string" ? r : r.name;
}
n(c, "getName");
const g = class g {
  static getInstance(e) {
    return p.getInstance(e, i);
  }
};
n(g, "VueService");
let v = g;
export {
  re as BindThis,
  Q as Component,
  z as Computed,
  ee as Hook,
  i as IoCModuleName,
  V as Link,
  Y as Mut,
  te as PropsWatcher,
  Z as Readonly,
  X as Service,
  l as VueComponent,
  v as VueService,
  oe as Watcher,
  P as applyMetadata,
  q as getMetadata,
  s as getOrCreateMetadata,
  K as toNative
};
