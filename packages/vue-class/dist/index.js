var P = Object.defineProperty;
var s = (o, e) => P(o, "name", { value: e, configurable: !0 });
import { IoC as l } from "ioc";
import { getCurrentInstance as E, defineComponent as S, watchEffect as T, watch as k, onServerPrefetch as j, onRenderTriggered as O, onRenderTracked as W, onErrorCaptured as C, onDeactivated as A, onActivated as R, onUpdated as B, onBeforeUnmount as $, onBeforeMount as H, onUnmounted as L, onMounted as _, shallowRef as q, ref as F, shallowReadonly as G, readonly as J, computed as M } from "vue";
const m = "vue-class", h = class h {
  constructor() {
    let e = E();
    if (!e)
      if (h.__test__)
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
s(h, "VueComponent"), h.__test__ = !1, h.defineProps = [];
let y = h;
function Z(o) {
  return S(
    () => {
      const e = l.getInstance(o, m);
      return U(o, e), e.render.bind(e);
    },
    {
      name: o.name,
      props: o.defineProps
      // emits: componentClass.defineEmits as any,
    }
  );
}
s(Z, "toNative");
const c = class c {
  constructor(e, t) {
    this.el = e, this.name = t;
  }
  static install(e) {
    const t = K().filter((r) => r[1].isDirective).map((r) => [r[1].directiveName, r]);
    c._directiveNameMapVueDirective = new Map(t);
    for (let r of t) {
      const n = r[1][1].directiveName, a = r[1][0];
      e.directive(n, {
        created(i, d) {
          c.getInstance(i, n, a).created(d);
        },
        mounted(i, d) {
          const p = c.getInstance(i, n, a);
          p.mounted(d), p.mountedAndUpdated(d);
        },
        updated(i, d) {
          const p = c.getInstance(i, n, a);
          p.updated(d), p.mountedAndUpdated(d);
        },
        beforeUnmount(i, d) {
          c.getInstance(i, n, a).beforeUnmount(
            d
          );
        },
        beforeUpdate(i, d) {
          c.getInstance(i, n, a).beforeUpdate(
            d
          );
        },
        beforeMount(i, d) {
          c.getInstance(i, n, a).beforeMount(
            d
          );
        },
        unmounted(i, d) {
          c.getInstance(i, n, a).unmounted(d);
        }
      });
    }
  }
  static getInstance(e, t, r) {
    if (!r && (r = this._directiveNameMapVueDirective.get(t), !r))
      throw new Error(
        "Unable to find the VueDirective class corresponding to the directive name"
      );
    let n = this._elMapVueDirective.get(e);
    n || this._elMapVueDirective.set(e, n = /* @__PURE__ */ new Map());
    let a = n.get(t);
    return a || n.set(t, a = new r(e, t)), a;
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
s(c, "VueDirective"), c._elMapVueDirective = /* @__PURE__ */ new Map(), c._directiveNameMapVueDirective = /* @__PURE__ */ new Map();
let v = c;
const w = class w {
  constructor() {
    this.isComponent = !1, this.isService = !1, this.isDirective = !1, this.directiveName = "", this.mutts = [], this.readonlys = [], this.links = [], this.bindThis = [], this.hooks = [], this.watchers = [], this.propsWatchers = [], this.computers = [];
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
        T(r, t.option);
      else {
        t.source instanceof Array || (t.source = [t.source]);
        const n = t.source.map((a) => typeof a == "string" ? e[Symbol.for(a)] ?? (() => e[a]) : () => a(e));
        k(n, r, t.option);
      }
    }
  }
  handlePropsWatchers(e) {
    for (let t of this.propsWatchers) {
      let r = e[t.methodName];
      if (typeof r != "function")
        throw new Error("Decorator PropsWatcher can only be used on methods");
      r = r.bind(e), k(e.props, r, t.option);
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
          L(r);
          break;
        case "onBeforeMount":
          H(r);
          break;
        case "onBeforeUnmount":
          $(r);
          break;
        case "onUpdated":
          B(r);
          break;
        case "onActivated":
          R(r);
          break;
        case "onDeactivated":
          A(r);
          break;
        case "onErrorCaptured":
          C(r);
          break;
        case "onRenderTracked":
          W(r);
          break;
        case "onRenderTriggered":
          O(r);
          break;
        case "onServerPrefetch":
          j(r);
          break;
        default:
          throw new Error("Unknown Hook Type " + t.type);
      }
    }
  }
  handleMut(e) {
    for (let t of this.mutts) {
      const r = e[t.propName], n = t.shallow ? q(r) : F(r);
      e[Symbol.for(t.propName)] = n, Object.defineProperty(e, t.propName, {
        configurable: !0,
        enumerable: !0,
        set(a) {
          n.value = a;
        },
        get() {
          return n.value;
        }
      });
    }
  }
  handleReadonly(e) {
    for (let t of this.readonlys) {
      const r = e[t.propName], n = t.shallow ? G(r) : J(r);
      e[Symbol.for(t.propName)] = n, Object.defineProperty(e, t.propName, {
        configurable: !0,
        enumerable: !0,
        get() {
          return n;
        }
      });
    }
  }
  handleLink(e) {
    for (let t of this.links) {
      let r = t.propName, n = "";
      t.refName ? r = t.refName : t.isDirective && (r = r.replace(/Directive$/, "")), t.isDirective && (n = t.directiveName ?? "", n || (n = r)), Object.defineProperty(e, t.propName, {
        configurable: !0,
        enumerable: !0,
        get() {
          var i;
          const a = (i = e.vueInstance.refs) == null ? void 0 : i[r];
          if (t.isDirective) {
            if (!a)
              throw new Error("There is no ref named " + r);
            return v.getInstance(a, n);
          }
          return a;
        }
      });
    }
  }
  handleComputer(e) {
    var r;
    if (!this.computers.length)
      return;
    const t = Object.getPrototypeOf(e);
    for (let n of this.computers) {
      const a = e[n];
      if (typeof a == "function") {
        const i = a.bind(e), d = M(i);
        e[Symbol.for(n)] = d, e[n] = () => d.value;
      } else {
        const i = (r = Object.getOwnPropertyDescriptor(
          t,
          n
        )) == null ? void 0 : r.get;
        if (!i)
          throw new Error(
            "Computer can only be used on getters or no parameter methods"
          );
        const d = M(() => i.call(e));
        e[Symbol.for(n)] = d, Object.defineProperty(e, n, {
          configurable: !0,
          get: () => d.value
        });
      }
    }
  }
};
s(w, "Metadata");
let g = w;
const b = /* @__PURE__ */ new Map();
function K() {
  return Array.from(b.entries());
}
s(K, "getAllMetadata");
function Q(o) {
  const e = b.get(o);
  if (!e)
    throw new Error("Unable to find corresponding Metadata instance");
  return e;
}
s(Q, "getMetadata");
const D = Symbol("__appliedMetadata__");
function U(o, e) {
  if (e[D])
    return;
  e[D] = !0;
  const t = Q(o);
  t.handleMut(e), t.handleReadonly(e), t.handleComputer(e), t.handleWatchers(e), t.handleBindThis(e), e instanceof y && (t.handleLink(e), t.handleHook(e), t.handlePropsWatchers(e));
}
s(U, "applyMetadata");
function u(o, e) {
  if (!e || typeof e == "string") {
    typeof o == "object" && (o = o.constructor);
    let t = b.get(o);
    return t || b.set(o, t = new g()), t;
  } else {
    let t = e.metadata.metadata;
    return t || (t = e.metadata.metadata = new g()), e.kind === "class" && b.set(o, t), t;
  }
}
s(u, "getOrCreateMetadata");
function x() {
  const o = l.Injectable({ moduleName: m });
  return (e, t) => {
    o(e, t), u(e, t).isComponent = !0;
  };
}
s(x, "Component");
function z(o) {
  const e = l.Injectable(
    Object.assign(
      {
        moduleName: m,
        onCreate: (t) => U(t.constructor, t)
      },
      o
    )
  );
  return (t, r) => {
    e(t, r), u(t, r).isService = !0;
  };
}
s(z, "Service");
function ee(o) {
  const e = l.Injectable({ moduleName: m });
  return (t, r) => {
    e(t, r);
    const n = u(t, r);
    n.isDirective = !0, o || (o = t.name.replace(/Directive$/, ""), o = o[0].toLowerCase() + o.slice(1)), n.directiveName = o;
  };
}
s(ee, "Directive");
function te(o) {
  return (e, t) => {
    u(e, t).mutts.push({ propName: f(t), shallow: o });
  };
}
s(te, "Mut");
function re(o) {
  return (e, t) => {
    u(e, t).readonlys.push({ propName: f(t), shallow: o });
  };
}
s(re, "Readonly");
function oe(o) {
  return (e, t) => {
    u(e, t).links.push({
      propName: f(t),
      refName: o == null ? void 0 : o.refName,
      isDirective: !!(o != null && o.isDirective || o != null && o.directiveName),
      directiveName: o == null ? void 0 : o.directiveName
    });
  };
}
s(oe, "Link");
function ne() {
  return (o, e) => {
    u(o, e).computers.push(f(e));
  };
}
s(ne, "Computed");
function ae(o) {
  return (e, t) => {
    u(e, t).hooks.push({
      methodName: f(t),
      type: o
    });
  };
}
s(ae, "Hook");
function ie(o) {
  return (e, t) => {
    u(e, t).propsWatchers.push({
      methodName: f(t),
      option: o
    });
  };
}
s(ie, "PropsWatcher");
function se(o) {
  return (e, t) => {
    u(e, t).watchers.push({
      methodName: f(t),
      ...o
    });
  };
}
s(se, "Watcher");
function de() {
  return (o, e) => {
    u(o, e).bindThis.push(f(e));
  };
}
s(de, "BindThis");
function f(o) {
  return typeof o == "string" ? o : o.name;
}
s(f, "getName");
const N = class N {
  static getInstance(e) {
    return l.getInstance(e, m);
  }
  static async install(e, t) {
    await l.importAll(() => t), v.install(e), l.load(m);
  }
};
s(N, "VueClass");
let I = N;
export {
  de as BindThis,
  x as Component,
  ne as Computed,
  ee as Directive,
  ae as Hook,
  oe as Link,
  g as Metadata,
  m as ModuleName,
  te as Mut,
  ie as PropsWatcher,
  re as Readonly,
  z as Service,
  I as VueClass,
  y as VueComponent,
  v as VueDirective,
  se as Watcher,
  U as applyMetadata,
  K as getAllMetadata,
  Q as getMetadata,
  u as getOrCreateMetadata,
  Z as toNative
};
