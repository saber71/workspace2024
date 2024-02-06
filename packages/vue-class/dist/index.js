var ue = Object.defineProperty;
var o = (e, t) => ue(e, "name", { value: t, configurable: !0 });
import { getCurrentInstance as se, defineComponent as ce, watchEffect as fe, watch as zt, onServerPrefetch as le, onRenderTriggered as de, onRenderTracked as he, onErrorCaptured as pe, onDeactivated as ve, onActivated as ye, onUpdated as ge, onBeforeUnmount as _e, onBeforeMount as we, onUnmounted as be, onMounted as me, ref as Ae, computed as tn } from "vue";
var nn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var en;
(function(e) {
  (function(t) {
    var n = typeof globalThis == "object" ? globalThis : typeof nn == "object" ? nn : typeof self == "object" ? self : typeof this == "object" ? this : d(), r = i(e);
    typeof n.Reflect < "u" && (r = i(n.Reflect, r)), t(r, n), typeof n.Reflect > "u" && (n.Reflect = e);
    function i(v, u) {
      return function(h, g) {
        Object.defineProperty(v, h, { configurable: !0, writable: !0, value: g }), u && u(h, g);
      };
    }
    o(i, "makeExporter");
    function a() {
      try {
        return Function("return this;")();
      } catch {
      }
    }
    o(a, "functionThis");
    function f() {
      try {
        return (0, eval)("(function() { return this; })()");
      } catch {
      }
    }
    o(f, "indirectEvalThis");
    function d() {
      return a() || f();
    }
    o(d, "sloppyModeThis");
  })(function(t, n) {
    var r = Object.prototype.hasOwnProperty, i = typeof Symbol == "function", a = i && typeof Symbol.toPrimitive < "u" ? Symbol.toPrimitive : "@@toPrimitive", f = i && typeof Symbol.iterator < "u" ? Symbol.iterator : "@@iterator", d = typeof Object.create == "function", v = { __proto__: [] } instanceof Array, u = !d && !v, h = {
      // create an object in dictionary mode (a.k.a. "slow" mode in v8)
      create: d ? function() {
        return St(/* @__PURE__ */ Object.create(null));
      } : v ? function() {
        return St({ __proto__: null });
      } : function() {
        return St({});
      },
      has: u ? function(s, c) {
        return r.call(s, c);
      } : function(s, c) {
        return c in s;
      },
      get: u ? function(s, c) {
        return r.call(s, c) ? s[c] : void 0;
      } : function(s, c) {
        return s[c];
      }
    }, g = Object.getPrototypeOf(Function), m = typeof Map == "function" && typeof Map.prototype.entries == "function" ? Map : ee(), M = typeof Set == "function" && typeof Set.prototype.entries == "function" ? Set : re(), N = typeof WeakMap == "function" ? WeakMap : ie(), E = i ? Symbol.for("@reflect-metadata:registry") : void 0, x = zn(), L = te(x);
    function xn(s, c, l, p) {
      if (T(l)) {
        if (!Yt(s))
          throw new TypeError();
        if (!$t(c))
          throw new TypeError();
        return Yn(s, c);
      } else {
        if (!Yt(s))
          throw new TypeError();
        if (!D(c))
          throw new TypeError();
        if (!D(p) && !T(p) && !Z(p))
          throw new TypeError();
        return Z(p) && (p = void 0), l = H(l), $n(s, c, l, p);
      }
    }
    o(xn, "decorate"), t("decorate", xn);
    function jn(s, c) {
      function l(p, A) {
        if (!D(p))
          throw new TypeError();
        if (!T(A) && !Zn(A))
          throw new TypeError();
        Gt(s, c, p, A);
      }
      return o(l, "decorator"), l;
    }
    o(jn, "metadata"), t("metadata", jn);
    function Bn(s, c, l, p) {
      if (!D(l))
        throw new TypeError();
      return T(p) || (p = H(p)), Gt(s, c, l, p);
    }
    o(Bn, "defineMetadata"), t("defineMetadata", Bn);
    function Fn(s, c, l) {
      if (!D(c))
        throw new TypeError();
      return T(l) || (l = H(l)), Bt(s, c, l);
    }
    o(Fn, "hasMetadata"), t("hasMetadata", Fn);
    function Wn(s, c, l) {
      if (!D(c))
        throw new TypeError();
      return T(l) || (l = H(l)), mt(s, c, l);
    }
    o(Wn, "hasOwnMetadata"), t("hasOwnMetadata", Wn);
    function Gn(s, c, l) {
      if (!D(c))
        throw new TypeError();
      return T(l) || (l = H(l)), Ft(s, c, l);
    }
    o(Gn, "getMetadata"), t("getMetadata", Gn);
    function Un(s, c, l) {
      if (!D(c))
        throw new TypeError();
      return T(l) || (l = H(l)), Wt(s, c, l);
    }
    o(Un, "getOwnMetadata"), t("getOwnMetadata", Un);
    function Vn(s, c) {
      if (!D(s))
        throw new TypeError();
      return T(c) || (c = H(c)), Ut(s, c);
    }
    o(Vn, "getMetadataKeys"), t("getMetadataKeys", Vn);
    function Ln(s, c) {
      if (!D(s))
        throw new TypeError();
      return T(c) || (c = H(c)), Vt(s, c);
    }
    o(Ln, "getOwnMetadataKeys"), t("getOwnMetadataKeys", Ln);
    function Hn(s, c, l) {
      if (!D(c))
        throw new TypeError();
      if (T(l) || (l = H(l)), !D(c))
        throw new TypeError();
      T(l) || (l = H(l));
      var p = tt(
        c,
        l,
        /*Create*/
        !1
      );
      return T(p) ? !1 : p.OrdinaryDeleteMetadata(s, c, l);
    }
    o(Hn, "deleteMetadata"), t("deleteMetadata", Hn);
    function Yn(s, c) {
      for (var l = s.length - 1; l >= 0; --l) {
        var p = s[l], A = p(c);
        if (!T(A) && !Z(A)) {
          if (!$t(A))
            throw new TypeError();
          c = A;
        }
      }
      return c;
    }
    o(Yn, "DecorateConstructor");
    function $n(s, c, l, p) {
      for (var A = s.length - 1; A >= 0; --A) {
        var k = s[A], j = k(c, l, p);
        if (!T(j) && !Z(j)) {
          if (!D(j))
            throw new TypeError();
          p = j;
        }
      }
      return p;
    }
    o($n, "DecorateProperty");
    function Bt(s, c, l) {
      var p = mt(s, c, l);
      if (p)
        return !0;
      var A = Tt(c);
      return Z(A) ? !1 : Bt(s, A, l);
    }
    o(Bt, "OrdinaryHasMetadata");
    function mt(s, c, l) {
      var p = tt(
        c,
        l,
        /*Create*/
        !1
      );
      return T(p) ? !1 : Ht(p.OrdinaryHasOwnMetadata(s, c, l));
    }
    o(mt, "OrdinaryHasOwnMetadata");
    function Ft(s, c, l) {
      var p = mt(s, c, l);
      if (p)
        return Wt(s, c, l);
      var A = Tt(c);
      if (!Z(A))
        return Ft(s, A, l);
    }
    o(Ft, "OrdinaryGetMetadata");
    function Wt(s, c, l) {
      var p = tt(
        c,
        l,
        /*Create*/
        !1
      );
      if (!T(p))
        return p.OrdinaryGetOwnMetadata(s, c, l);
    }
    o(Wt, "OrdinaryGetOwnMetadata");
    function Gt(s, c, l, p) {
      var A = tt(
        l,
        p,
        /*Create*/
        !0
      );
      A.OrdinaryDefineOwnMetadata(s, c, l, p);
    }
    o(Gt, "OrdinaryDefineOwnMetadata");
    function Ut(s, c) {
      var l = Vt(s, c), p = Tt(s);
      if (p === null)
        return l;
      var A = Ut(p, c);
      if (A.length <= 0)
        return l;
      if (l.length <= 0)
        return A;
      for (var k = new M(), j = [], S = 0, y = l; S < y.length; S++) {
        var w = y[S], _ = k.has(w);
        _ || (k.add(w), j.push(w));
      }
      for (var b = 0, I = A; b < I.length; b++) {
        var w = I[b], _ = k.has(w);
        _ || (k.add(w), j.push(w));
      }
      return j;
    }
    o(Ut, "OrdinaryMetadataKeys");
    function Vt(s, c) {
      var l = tt(
        s,
        c,
        /*create*/
        !1
      );
      return l ? l.OrdinaryOwnMetadataKeys(s, c) : [];
    }
    o(Vt, "OrdinaryOwnMetadataKeys");
    function Lt(s) {
      if (s === null)
        return 1;
      switch (typeof s) {
        case "undefined":
          return 0;
        case "boolean":
          return 2;
        case "string":
          return 3;
        case "symbol":
          return 4;
        case "number":
          return 5;
        case "object":
          return s === null ? 1 : 6;
        default:
          return 6;
      }
    }
    o(Lt, "Type");
    function T(s) {
      return s === void 0;
    }
    o(T, "IsUndefined");
    function Z(s) {
      return s === null;
    }
    o(Z, "IsNull");
    function Jn(s) {
      return typeof s == "symbol";
    }
    o(Jn, "IsSymbol");
    function D(s) {
      return typeof s == "object" ? s !== null : typeof s == "function";
    }
    o(D, "IsObject");
    function Kn(s, c) {
      switch (Lt(s)) {
        case 0:
          return s;
        case 1:
          return s;
        case 2:
          return s;
        case 3:
          return s;
        case 4:
          return s;
        case 5:
          return s;
      }
      var l = c === 3 ? "string" : c === 5 ? "number" : "default", p = Jt(s, a);
      if (p !== void 0) {
        var A = p.call(s, l);
        if (D(A))
          throw new TypeError();
        return A;
      }
      return qn(s, l === "default" ? "number" : l);
    }
    o(Kn, "ToPrimitive");
    function qn(s, c) {
      if (c === "string") {
        var l = s.toString;
        if (X(l)) {
          var p = l.call(s);
          if (!D(p))
            return p;
        }
        var A = s.valueOf;
        if (X(A)) {
          var p = A.call(s);
          if (!D(p))
            return p;
        }
      } else {
        var A = s.valueOf;
        if (X(A)) {
          var p = A.call(s);
          if (!D(p))
            return p;
        }
        var k = s.toString;
        if (X(k)) {
          var p = k.call(s);
          if (!D(p))
            return p;
        }
      }
      throw new TypeError();
    }
    o(qn, "OrdinaryToPrimitive");
    function Ht(s) {
      return !!s;
    }
    o(Ht, "ToBoolean");
    function Qn(s) {
      return "" + s;
    }
    o(Qn, "ToString");
    function H(s) {
      var c = Kn(
        s,
        3
        /* String */
      );
      return Jn(c) ? c : Qn(c);
    }
    o(H, "ToPropertyKey");
    function Yt(s) {
      return Array.isArray ? Array.isArray(s) : s instanceof Object ? s instanceof Array : Object.prototype.toString.call(s) === "[object Array]";
    }
    o(Yt, "IsArray");
    function X(s) {
      return typeof s == "function";
    }
    o(X, "IsCallable");
    function $t(s) {
      return typeof s == "function";
    }
    o($t, "IsConstructor");
    function Zn(s) {
      switch (Lt(s)) {
        case 3:
          return !0;
        case 4:
          return !0;
        default:
          return !1;
      }
    }
    o(Zn, "IsPropertyKey");
    function At(s, c) {
      return s === c || s !== s && c !== c;
    }
    o(At, "SameValueZero");
    function Jt(s, c) {
      var l = s[c];
      if (l != null) {
        if (!X(l))
          throw new TypeError();
        return l;
      }
    }
    o(Jt, "GetMethod");
    function Kt(s) {
      var c = Jt(s, f);
      if (!X(c))
        throw new TypeError();
      var l = c.call(s);
      if (!D(l))
        throw new TypeError();
      return l;
    }
    o(Kt, "GetIterator");
    function qt(s) {
      return s.value;
    }
    o(qt, "IteratorValue");
    function Qt(s) {
      var c = s.next();
      return c.done ? !1 : c;
    }
    o(Qt, "IteratorStep");
    function Zt(s) {
      var c = s.return;
      c && c.call(s);
    }
    o(Zt, "IteratorClose");
    function Tt(s) {
      var c = Object.getPrototypeOf(s);
      if (typeof s != "function" || s === g || c !== g)
        return c;
      var l = s.prototype, p = l && Object.getPrototypeOf(l);
      if (p == null || p === Object.prototype)
        return c;
      var A = p.constructor;
      return typeof A != "function" || A === s ? c : A;
    }
    o(Tt, "OrdinaryGetPrototypeOf");
    function Xn() {
      var s;
      !T(E) && typeof n.Reflect < "u" && !(E in n.Reflect) && typeof n.Reflect.defineMetadata == "function" && (s = ne(n.Reflect));
      var c, l, p, A = new N(), k = {
        registerProvider: j,
        getProvider: y,
        setProvider: _
      };
      return k;
      function j(b) {
        if (!Object.isExtensible(k))
          throw new Error("Cannot add provider to a frozen registry.");
        switch (!0) {
          case s === b:
            break;
          case T(c):
            c = b;
            break;
          case c === b:
            break;
          case T(l):
            l = b;
            break;
          case l === b:
            break;
          default:
            p === void 0 && (p = new M()), p.add(b);
            break;
        }
      }
      function S(b, I) {
        if (!T(c)) {
          if (c.isProviderFor(b, I))
            return c;
          if (!T(l)) {
            if (l.isProviderFor(b, I))
              return c;
            if (!T(p))
              for (var O = Kt(p); ; ) {
                var P = Qt(O);
                if (!P)
                  return;
                var V = qt(P);
                if (V.isProviderFor(b, I))
                  return Zt(O), V;
              }
          }
        }
        if (!T(s) && s.isProviderFor(b, I))
          return s;
      }
      function y(b, I) {
        var O = A.get(b), P;
        return T(O) || (P = O.get(I)), T(P) && (P = S(b, I), T(P) || (T(O) && (O = new m(), A.set(b, O)), O.set(I, P))), P;
      }
      function w(b) {
        if (T(b))
          throw new TypeError();
        return c === b || l === b || !T(p) && p.has(b);
      }
      function _(b, I, O) {
        if (!w(O))
          throw new Error("Metadata provider not registered.");
        var P = y(b, I);
        if (P !== O) {
          if (!T(P))
            return !1;
          var V = A.get(b);
          T(V) && (V = new m(), A.set(b, V)), V.set(I, O);
        }
        return !0;
      }
    }
    o(Xn, "CreateMetadataRegistry");
    function zn() {
      var s;
      return !T(E) && D(n.Reflect) && Object.isExtensible(n.Reflect) && (s = n.Reflect[E]), T(s) && (s = Xn()), !T(E) && D(n.Reflect) && Object.isExtensible(n.Reflect) && Object.defineProperty(n.Reflect, E, {
        enumerable: !1,
        configurable: !1,
        writable: !1,
        value: s
      }), s;
    }
    o(zn, "GetOrCreateMetadataRegistry");
    function te(s) {
      var c = new N(), l = {
        isProviderFor: function(w, _) {
          var b = c.get(w);
          return T(b) ? !1 : b.has(_);
        },
        OrdinaryDefineOwnMetadata: j,
        OrdinaryHasOwnMetadata: A,
        OrdinaryGetOwnMetadata: k,
        OrdinaryOwnMetadataKeys: S,
        OrdinaryDeleteMetadata: y
      };
      return x.registerProvider(l), l;
      function p(w, _, b) {
        var I = c.get(w), O = !1;
        if (T(I)) {
          if (!b)
            return;
          I = new m(), c.set(w, I), O = !0;
        }
        var P = I.get(_);
        if (T(P)) {
          if (!b)
            return;
          if (P = new m(), I.set(_, P), !s.setProvider(w, _, l))
            throw I.delete(_), O && c.delete(w), new Error("Wrong provider for target.");
        }
        return P;
      }
      o(p, "GetOrCreateMetadataMap");
      function A(w, _, b) {
        var I = p(
          _,
          b,
          /*Create*/
          !1
        );
        return T(I) ? !1 : Ht(I.has(w));
      }
      o(A, "OrdinaryHasOwnMetadata");
      function k(w, _, b) {
        var I = p(
          _,
          b,
          /*Create*/
          !1
        );
        if (!T(I))
          return I.get(w);
      }
      o(k, "OrdinaryGetOwnMetadata");
      function j(w, _, b, I) {
        var O = p(
          b,
          I,
          /*Create*/
          !0
        );
        O.set(w, _);
      }
      o(j, "OrdinaryDefineOwnMetadata");
      function S(w, _) {
        var b = [], I = p(
          w,
          _,
          /*Create*/
          !1
        );
        if (T(I))
          return b;
        for (var O = I.keys(), P = Kt(O), V = 0; ; ) {
          var Xt = Qt(P);
          if (!Xt)
            return b.length = V, b;
          var ae = qt(Xt);
          try {
            b[V] = ae;
          } catch (oe) {
            try {
              Zt(P);
            } finally {
              throw oe;
            }
          }
          V++;
        }
      }
      o(S, "OrdinaryOwnMetadataKeys");
      function y(w, _, b) {
        var I = p(
          _,
          b,
          /*Create*/
          !1
        );
        if (T(I) || !I.delete(w))
          return !1;
        if (I.size === 0) {
          var O = c.get(_);
          T(O) || (O.delete(b), O.size === 0 && c.delete(O));
        }
        return !0;
      }
      o(y, "OrdinaryDeleteMetadata");
    }
    o(te, "CreateMetadataProvider");
    function ne(s) {
      var c = s.defineMetadata, l = s.hasOwnMetadata, p = s.getOwnMetadata, A = s.getOwnMetadataKeys, k = s.deleteMetadata, j = new N(), S = {
        isProviderFor: function(y, w) {
          var _ = j.get(y);
          return T(_) ? A(y, w).length ? (T(_) && (_ = new M(), j.set(y, _)), _.add(w), !0) : !1 : _.has(w);
        },
        OrdinaryDefineOwnMetadata: c,
        OrdinaryHasOwnMetadata: l,
        OrdinaryGetOwnMetadata: p,
        OrdinaryOwnMetadataKeys: A,
        OrdinaryDeleteMetadata: k
      };
      return S;
    }
    o(ne, "CreateFallbackProvider");
    function tt(s, c, l) {
      var p = x.getProvider(s, c);
      if (!T(p))
        return p;
      if (l) {
        if (x.setProvider(s, c, L))
          return L;
        throw new Error("Illegal state.");
      }
    }
    o(tt, "GetMetadataProvider");
    function ee() {
      var s = {}, c = [], l = (
        /** @class */
        function() {
          function S(y, w, _) {
            this._index = 0, this._keys = y, this._values = w, this._selector = _;
          }
          return o(S, "MapIterator"), S.prototype["@@iterator"] = function() {
            return this;
          }, S.prototype[f] = function() {
            return this;
          }, S.prototype.next = function() {
            var y = this._index;
            if (y >= 0 && y < this._keys.length) {
              var w = this._selector(this._keys[y], this._values[y]);
              return y + 1 >= this._keys.length ? (this._index = -1, this._keys = c, this._values = c) : this._index++, { value: w, done: !1 };
            }
            return { value: void 0, done: !0 };
          }, S.prototype.throw = function(y) {
            throw this._index >= 0 && (this._index = -1, this._keys = c, this._values = c), y;
          }, S.prototype.return = function(y) {
            return this._index >= 0 && (this._index = -1, this._keys = c, this._values = c), { value: y, done: !0 };
          }, S;
        }()
      ), p = (
        /** @class */
        function() {
          function S() {
            this._keys = [], this._values = [], this._cacheKey = s, this._cacheIndex = -2;
          }
          return o(S, "Map"), Object.defineProperty(S.prototype, "size", {
            get: function() {
              return this._keys.length;
            },
            enumerable: !0,
            configurable: !0
          }), S.prototype.has = function(y) {
            return this._find(
              y,
              /*insert*/
              !1
            ) >= 0;
          }, S.prototype.get = function(y) {
            var w = this._find(
              y,
              /*insert*/
              !1
            );
            return w >= 0 ? this._values[w] : void 0;
          }, S.prototype.set = function(y, w) {
            var _ = this._find(
              y,
              /*insert*/
              !0
            );
            return this._values[_] = w, this;
          }, S.prototype.delete = function(y) {
            var w = this._find(
              y,
              /*insert*/
              !1
            );
            if (w >= 0) {
              for (var _ = this._keys.length, b = w + 1; b < _; b++)
                this._keys[b - 1] = this._keys[b], this._values[b - 1] = this._values[b];
              return this._keys.length--, this._values.length--, At(y, this._cacheKey) && (this._cacheKey = s, this._cacheIndex = -2), !0;
            }
            return !1;
          }, S.prototype.clear = function() {
            this._keys.length = 0, this._values.length = 0, this._cacheKey = s, this._cacheIndex = -2;
          }, S.prototype.keys = function() {
            return new l(this._keys, this._values, A);
          }, S.prototype.values = function() {
            return new l(this._keys, this._values, k);
          }, S.prototype.entries = function() {
            return new l(this._keys, this._values, j);
          }, S.prototype["@@iterator"] = function() {
            return this.entries();
          }, S.prototype[f] = function() {
            return this.entries();
          }, S.prototype._find = function(y, w) {
            if (!At(this._cacheKey, y)) {
              this._cacheIndex = -1;
              for (var _ = 0; _ < this._keys.length; _++)
                if (At(this._keys[_], y)) {
                  this._cacheIndex = _;
                  break;
                }
            }
            return this._cacheIndex < 0 && w && (this._cacheIndex = this._keys.length, this._keys.push(y), this._values.push(void 0)), this._cacheIndex;
          }, S;
        }()
      );
      return p;
      function A(S, y) {
        return S;
      }
      function k(S, y) {
        return y;
      }
      function j(S, y) {
        return [S, y];
      }
    }
    o(ee, "CreateMapPolyfill");
    function re() {
      var s = (
        /** @class */
        function() {
          function c() {
            this._map = new m();
          }
          return o(c, "Set"), Object.defineProperty(c.prototype, "size", {
            get: function() {
              return this._map.size;
            },
            enumerable: !0,
            configurable: !0
          }), c.prototype.has = function(l) {
            return this._map.has(l);
          }, c.prototype.add = function(l) {
            return this._map.set(l, l), this;
          }, c.prototype.delete = function(l) {
            return this._map.delete(l);
          }, c.prototype.clear = function() {
            this._map.clear();
          }, c.prototype.keys = function() {
            return this._map.keys();
          }, c.prototype.values = function() {
            return this._map.keys();
          }, c.prototype.entries = function() {
            return this._map.entries();
          }, c.prototype["@@iterator"] = function() {
            return this.keys();
          }, c.prototype[f] = function() {
            return this.keys();
          }, c;
        }()
      );
      return s;
    }
    o(re, "CreateSetPolyfill");
    function ie() {
      var s = 16, c = h.create(), l = p();
      return (
        /** @class */
        function() {
          function y() {
            this._key = p();
          }
          return o(y, "WeakMap"), y.prototype.has = function(w) {
            var _ = A(
              w,
              /*create*/
              !1
            );
            return _ !== void 0 ? h.has(_, this._key) : !1;
          }, y.prototype.get = function(w) {
            var _ = A(
              w,
              /*create*/
              !1
            );
            return _ !== void 0 ? h.get(_, this._key) : void 0;
          }, y.prototype.set = function(w, _) {
            var b = A(
              w,
              /*create*/
              !0
            );
            return b[this._key] = _, this;
          }, y.prototype.delete = function(w) {
            var _ = A(
              w,
              /*create*/
              !1
            );
            return _ !== void 0 ? delete _[this._key] : !1;
          }, y.prototype.clear = function() {
            this._key = p();
          }, y;
        }()
      );
      function p() {
        var y;
        do
          y = "@@WeakMap@@" + S();
        while (h.has(c, y));
        return c[y] = !0, y;
      }
      function A(y, w) {
        if (!r.call(y, l)) {
          if (!w)
            return;
          Object.defineProperty(y, l, { value: h.create() });
        }
        return y[l];
      }
      function k(y, w) {
        for (var _ = 0; _ < w; ++_)
          y[_] = Math.random() * 255 | 0;
        return y;
      }
      function j(y) {
        return typeof Uint8Array == "function" ? typeof crypto < "u" ? crypto.getRandomValues(new Uint8Array(y)) : typeof msCrypto < "u" ? msCrypto.getRandomValues(new Uint8Array(y)) : k(new Uint8Array(y), y) : k(new Array(y), y);
      }
      function S() {
        var y = j(s);
        y[6] = y[6] & 79 | 64, y[8] = y[8] & 191 | 128;
        for (var w = "", _ = 0; _ < s; ++_) {
          var b = y[_];
          (_ === 4 || _ === 6 || _ === 8) && (w += "-"), b < 16 && (w += "0"), w += b.toString(16).toLowerCase();
        }
        return w;
      }
    }
    o(ie, "CreateWeakMapPolyfill");
    function St(s) {
      return s.__ = void 0, delete s.__, s;
    }
    o(St, "MakeDictionary");
  });
})(en || (en = {}));
var U = "named", hn = "name", kt = "unmanaged", pn = "optional", _t = "inject", at = "multi_inject", vn = "inversify:tagged", yn = "inversify:tagged_props", Mt = "inversify:paramtypes", Te = "design:paramtypes", rn = "post_construct", Et = "pre_destroy";
function Se() {
  return [
    _t,
    at,
    hn,
    kt,
    U,
    pn
  ];
}
o(Se, "getNonCustomTagKeys");
var an = Se(), R = {
  Request: "Request",
  Singleton: "Singleton",
  Transient: "Transient"
}, C = {
  ConstantValue: "ConstantValue",
  Constructor: "Constructor",
  DynamicValue: "DynamicValue",
  Factory: "Factory",
  Function: "Function",
  Instance: "Instance",
  Invalid: "Invalid",
  Provider: "Provider"
}, ct = {
  ClassProperty: "ClassProperty",
  ConstructorArgument: "ConstructorArgument",
  Variable: "Variable"
}, Ie = 0;
function ft() {
  return Ie++;
}
o(ft, "id");
var Me = function() {
  function e(t, n) {
    this.id = ft(), this.activated = !1, this.serviceIdentifier = t, this.scope = n, this.type = C.Invalid, this.constraint = function(r) {
      return !0;
    }, this.implementationType = null, this.cache = null, this.factory = null, this.provider = null, this.onActivation = null, this.onDeactivation = null, this.dynamicValue = null;
  }
  return o(e, "Binding"), e.prototype.clone = function() {
    var t = new e(this.serviceIdentifier, this.scope);
    return t.activated = t.scope === R.Singleton ? this.activated : !1, t.implementationType = this.implementationType, t.dynamicValue = this.dynamicValue, t.scope = this.scope, t.type = this.type, t.factory = this.factory, t.provider = this.provider, t.constraint = this.constraint, t.onActivation = this.onActivation, t.onDeactivation = this.onDeactivation, t.cache = this.cache, t;
  }, e;
}(), Ee = "Cannot apply @injectable decorator multiple times.", gn = "Metadata key was used more than once in a parameter:", nt = "NULL argument", on = "Key Not Found", Oe = "Ambiguous match found for serviceIdentifier:", Ce = "Could not unbind serviceIdentifier:", Ne = "No matching bindings found for serviceIdentifier:", _n = "Missing required @injectable annotation in:", De = "Missing required @inject or @multiInject annotation in:", ke = /* @__PURE__ */ o(function(e) {
  return "@inject called with undefined this could mean that the class " + e + " has a circular dependency problem. You can use a LazyServiceIdentifier to  overcome this limitation.";
}, "UNDEFINED_INJECT_ANNOTATION"), Pe = "Circular dependency found:", Re = "Invalid binding type:", xe = "No snapshot available to restore.", je = "Invalid return type in middleware. Middleware must return!", Be = "Value provided to function binding must be a function!", Fe = /* @__PURE__ */ o(function(e) {
  return "You are attempting to construct '" + e + `' in a synchronous way
 but it has asynchronous dependencies.`;
}, "LAZY_IN_SYNC"), We = "The toSelf function can only be applied when a constructor is used as service identifier", wn = "The @inject @multiInject @tagged and @named decorators must be applied to the parameters of a class constructor or a class property.", Ge = /* @__PURE__ */ o(function() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  return "The number of constructor arguments in the derived class " + (e[0] + " must be >= than the number of constructor arguments of its base class.");
}, "ARGUMENTS_LENGTH_MISMATCH"), Ue = "Invalid Container constructor argument. Container options must be an object.", Ve = 'Invalid Container option. Default scope must be a string ("singleton" or "transient").', Le = "Invalid Container option. Auto bind injectable must be a boolean", He = "Invalid Container option. Skip base check must be a boolean", Ye = "Attempting to unbind dependency with asynchronous destruction (@preDestroy or onDeactivation)", $e = /* @__PURE__ */ o(function(e, t) {
  return "@postConstruct error in class " + e + ": " + t;
}, "POST_CONSTRUCT_ERROR"), Je = /* @__PURE__ */ o(function(e, t) {
  return "@preDestroy error in class " + e + ": " + t;
}, "PRE_DESTROY_ERROR"), Ot = /* @__PURE__ */ o(function(e, t) {
  return "onDeactivation() error in class " + e + ": " + t;
}, "ON_DEACTIVATION_ERROR"), Ke = /* @__PURE__ */ o(function(e, t) {
  return "It looks like there is a circular dependency in one of the '" + e + "' bindings. Please investigate bindings with " + ("service identifier '" + t + "'.");
}, "CIRCULAR_DEPENDENCY_IN_FACTORY"), qe = "Maximum call stack size exceeded", Qe = function() {
  function e() {
  }
  return o(e, "MetadataReader"), e.prototype.getConstructorMetadata = function(t) {
    var n = Reflect.getMetadata(Mt, t), r = Reflect.getMetadata(vn, t);
    return {
      compilerGeneratedMetadata: n,
      userGeneratedMetadata: r || {}
    };
  }, e.prototype.getPropertiesMetadata = function(t) {
    var n = Reflect.getMetadata(yn, t) || [];
    return n;
  }, e;
}(), dt = {
  MultipleBindingsAvailable: 2,
  NoBindingsAvailable: 0,
  OnlyOneBindingAvailable: 1
};
function bn(e) {
  return e instanceof RangeError || e.message === qe;
}
o(bn, "isStackOverflowExeption");
var Ze = /* @__PURE__ */ o(function(e, t) {
  try {
    return e();
  } catch (n) {
    throw bn(n) && (n = t()), n;
  }
}, "tryAndThrowErrorIfStackOverflow");
function ot(e) {
  if (typeof e == "function") {
    var t = e;
    return t.name;
  } else {
    if (typeof e == "symbol")
      return e.toString();
    var t = e;
    return t;
  }
}
o(ot, "getServiceIdentifierAsString");
function un(e, t, n) {
  var r = "", i = n(e, t);
  return i.length !== 0 && (r = `
Registered bindings:`, i.forEach(function(a) {
    var f = "Object";
    a.implementationType !== null && (f = wt(a.implementationType)), r = r + `
 ` + f, a.constraint.metaData && (r = r + " - " + a.constraint.metaData);
  })), r;
}
o(un, "listRegisteredBindingsForServiceIdentifier");
function mn(e, t) {
  return e.parentRequest === null ? !1 : e.parentRequest.serviceIdentifier === t ? !0 : mn(e.parentRequest, t);
}
o(mn, "alreadyDependencyChain");
function Xe(e) {
  function t(r, i) {
    i === void 0 && (i = []);
    var a = ot(r.serviceIdentifier);
    return i.push(a), r.parentRequest !== null ? t(r.parentRequest, i) : i;
  }
  o(t, "_createStringArr");
  var n = t(e);
  return n.reverse().join(" --> ");
}
o(Xe, "dependencyChainToString");
function An(e) {
  e.childRequests.forEach(function(t) {
    if (mn(t, t.serviceIdentifier)) {
      var n = Xe(t);
      throw new Error(Pe + " " + n);
    } else
      An(t);
  });
}
o(An, "circularDependencyToException");
function ze(e, t) {
  if (t.isTagged() || t.isNamed()) {
    var n = "", r = t.getNamedTag(), i = t.getCustomTags();
    return r !== null && (n += r.toString() + `
`), i !== null && i.forEach(function(a) {
      n += a.toString() + `
`;
    }), " " + e + `
 ` + e + " - " + n;
  } else
    return " " + e;
}
o(ze, "listMetadataForTarget");
function wt(e) {
  if (e.name)
    return e.name;
  var t = e.toString(), n = t.match(/^function\s*([^\s(]+)/);
  return n ? n[1] : "Anonymous function: " + t;
}
o(wt, "getFunctionName");
function tr(e) {
  return e.toString().slice(7, -1);
}
o(tr, "getSymbolDescription");
var Tn = function() {
  function e(t) {
    this.id = ft(), this.container = t;
  }
  return o(e, "Context"), e.prototype.addPlan = function(t) {
    this.plan = t;
  }, e.prototype.setCurrentRequest = function(t) {
    this.currentRequest = t;
  }, e;
}(), Q = function() {
  function e(t, n) {
    this.key = t, this.value = n;
  }
  return o(e, "Metadata"), e.prototype.toString = function() {
    return this.key === U ? "named: " + String(this.value).toString() + " " : "tagged: { key:" + this.key.toString() + ", value: " + String(this.value) + " }";
  }, e;
}(), nr = function() {
  function e(t, n) {
    this.parentContext = t, this.rootRequest = n;
  }
  return o(e, "Plan"), e;
}(), er = function() {
  function e(t) {
    this._cb = t;
  }
  return o(e, "LazyServiceIdentifier"), e.prototype.unwrap = function() {
    return this._cb();
  }, e;
}(), rr = function() {
  function e(t) {
    this.str = t;
  }
  return o(e, "QueryableString"), e.prototype.startsWith = function(t) {
    return this.str.indexOf(t) === 0;
  }, e.prototype.endsWith = function(t) {
    var n = "", r = t.split("").reverse().join("");
    return n = this.str.split("").reverse().join(""), this.startsWith.call({ str: n }, r);
  }, e.prototype.contains = function(t) {
    return this.str.indexOf(t) !== -1;
  }, e.prototype.equals = function(t) {
    return this.str === t;
  }, e.prototype.value = function() {
    return this.str;
  }, e;
}(), bt = function() {
  function e(t, n, r, i) {
    this.id = ft(), this.type = t, this.serviceIdentifier = r;
    var a = typeof n == "symbol" ? tr(n) : n;
    this.name = new rr(a || ""), this.identifier = n, this.metadata = new Array();
    var f = null;
    typeof i == "string" ? f = new Q(U, i) : i instanceof Q && (f = i), f !== null && this.metadata.push(f);
  }
  return o(e, "Target"), e.prototype.hasTag = function(t) {
    for (var n = 0, r = this.metadata; n < r.length; n++) {
      var i = r[n];
      if (i.key === t)
        return !0;
    }
    return !1;
  }, e.prototype.isArray = function() {
    return this.hasTag(at);
  }, e.prototype.matchesArray = function(t) {
    return this.matchesTag(at)(t);
  }, e.prototype.isNamed = function() {
    return this.hasTag(U);
  }, e.prototype.isTagged = function() {
    return this.metadata.some(function(t) {
      return an.every(function(n) {
        return t.key !== n;
      });
    });
  }, e.prototype.isOptional = function() {
    return this.matchesTag(pn)(!0);
  }, e.prototype.getNamedTag = function() {
    return this.isNamed() ? this.metadata.filter(function(t) {
      return t.key === U;
    })[0] : null;
  }, e.prototype.getCustomTags = function() {
    return this.isTagged() ? this.metadata.filter(function(t) {
      return an.every(function(n) {
        return t.key !== n;
      });
    }) : null;
  }, e.prototype.matchesNamedTag = function(t) {
    return this.matchesTag(U)(t);
  }, e.prototype.matchesTag = function(t) {
    var n = this;
    return function(r) {
      for (var i = 0, a = n.metadata; i < a.length; i++) {
        var f = a[i];
        if (f.key === t && f.value === r)
          return !0;
      }
      return !1;
    };
  }, e;
}(), ht = function(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, i = t.length, a; r < i; r++)
      (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
};
function ir(e, t) {
  var n = wt(t);
  return Sn(e, n, t, !1);
}
o(ir, "getDependencies");
function Sn(e, t, n, r) {
  var i = e.getConstructorMetadata(n), a = i.compilerGeneratedMetadata;
  if (a === void 0) {
    var f = _n + " " + t + ".";
    throw new Error(f);
  }
  var d = i.userGeneratedMetadata, v = Object.keys(d), u = n.length === 0 && v.length > 0, h = v.length > n.length, g = u || h ? v.length : n.length, m = or(r, t, a, d, g), M = In(e, n, t), N = ht(ht([], m, !0), M, !0);
  return N;
}
o(Sn, "getTargets");
function ar(e, t, n, r, i) {
  var a = i[e.toString()] || [], f = En(a), d = f.unmanaged !== !0, v = r[e], u = f.inject || f.multiInject;
  if (v = u || v, v instanceof er && (v = v.unwrap()), d) {
    var h = v === Object, g = v === Function, m = v === void 0, M = h || g || m;
    if (!t && M) {
      var N = De + " argument " + e + " in class " + n + ".";
      throw new Error(N);
    }
    var E = new bt(ct.ConstructorArgument, f.targetName, v);
    return E.metadata = a, E;
  }
  return null;
}
o(ar, "getConstructorArgsAsTarget");
function or(e, t, n, r, i) {
  for (var a = [], f = 0; f < i; f++) {
    var d = f, v = ar(d, e, t, n, r);
    v !== null && a.push(v);
  }
  return a;
}
o(or, "getConstructorArgsAsTargets");
function ur(e, t, n, r) {
  var i = e || t;
  if (i === void 0) {
    var a = _n + " for property " + String(n) + " in class " + r + ".";
    throw new Error(a);
  }
  return i;
}
o(ur, "_getServiceIdentifierForProperty");
function In(e, t, n) {
  for (var r = e.getPropertiesMetadata(t), i = [], a = Object.getOwnPropertySymbols(r), f = Object.keys(r), d = f.concat(a), v = 0, u = d; v < u.length; v++) {
    var h = u[v], g = r[h], m = En(g), M = m.targetName || h, N = ur(m.inject, m.multiInject, h, n), E = new bt(ct.ClassProperty, M, N);
    E.metadata = g, i.push(E);
  }
  var x = Object.getPrototypeOf(t.prototype).constructor;
  if (x !== Object) {
    var L = In(e, x, n);
    i = ht(ht([], i, !0), L, !0);
  }
  return i;
}
o(In, "getClassPropsAsTargets");
function Mn(e, t) {
  var n = Object.getPrototypeOf(t.prototype).constructor;
  if (n !== Object) {
    var r = wt(n), i = Sn(e, r, n, !0), a = i.map(function(v) {
      return v.metadata.filter(function(u) {
        return u.key === kt;
      });
    }), f = [].concat.apply([], a).length, d = i.length - f;
    return d > 0 ? d : Mn(e, n);
  } else
    return 0;
}
o(Mn, "getBaseClassDependencyCount");
function En(e) {
  var t = {};
  return e.forEach(function(n) {
    t[n.key.toString()] = n.value;
  }), {
    inject: t[_t],
    multiInject: t[at],
    targetName: t[hn],
    unmanaged: t[kt]
  };
}
o(En, "formatTargetMetadata");
var Pt = function() {
  function e(t, n, r, i, a) {
    this.id = ft(), this.serviceIdentifier = t, this.parentContext = n, this.parentRequest = r, this.target = a, this.childRequests = [], this.bindings = Array.isArray(i) ? i : [i], this.requestScope = r === null ? /* @__PURE__ */ new Map() : null;
  }
  return o(e, "Request"), e.prototype.addChildRequest = function(t, n, r) {
    var i = new e(t, this.parentContext, this, n, r);
    return this.childRequests.push(i), i;
  }, e;
}();
function pt(e) {
  return e._bindingDictionary;
}
o(pt, "getBindingDictionary");
function sr(e, t, n, r, i, a) {
  var f = e ? at : _t, d = new Q(f, n), v = new bt(t, r, n, d);
  if (i !== void 0) {
    var u = new Q(i, a);
    v.metadata.push(u);
  }
  return v;
}
o(sr, "_createTarget");
function sn(e, t, n, r, i) {
  var a = ut(n.container, i.serviceIdentifier), f = [];
  return a.length === dt.NoBindingsAvailable && n.container.options.autoBindInjectable && typeof i.serviceIdentifier == "function" && e.getConstructorMetadata(i.serviceIdentifier).compilerGeneratedMetadata && (n.container.bind(i.serviceIdentifier).toSelf(), a = ut(n.container, i.serviceIdentifier)), t ? f = a : f = a.filter(function(d) {
    var v = new Pt(d.serviceIdentifier, n, r, d, i);
    return d.constraint(v);
  }), cr(i.serviceIdentifier, f, i, n.container), f;
}
o(sn, "_getActiveBindings");
function cr(e, t, n, r) {
  switch (t.length) {
    case dt.NoBindingsAvailable:
      if (n.isOptional())
        return t;
      var i = ot(e), a = Ne;
      throw a += ze(i, n), a += un(r, i, ut), new Error(a);
    case dt.OnlyOneBindingAvailable:
      return t;
    case dt.MultipleBindingsAvailable:
    default:
      if (n.isArray())
        return t;
      var i = ot(e), a = Oe + " " + i;
      throw a += un(r, i, ut), new Error(a);
  }
}
o(cr, "_validateActiveBindingCount");
function On(e, t, n, r, i, a) {
  var f, d;
  if (i === null) {
    f = sn(e, t, r, null, a), d = new Pt(n, r, null, f, a);
    var v = new nr(r, d);
    r.addPlan(v);
  } else
    f = sn(e, t, r, i, a), d = i.addChildRequest(a.serviceIdentifier, f, a);
  f.forEach(function(u) {
    var h = null;
    if (a.isArray())
      h = d.addChildRequest(u.serviceIdentifier, u, a);
    else {
      if (u.cache)
        return;
      h = d;
    }
    if (u.type === C.Instance && u.implementationType !== null) {
      var g = ir(e, u.implementationType);
      if (!r.container.options.skipBaseClassChecks) {
        var m = Mn(e, u.implementationType);
        if (g.length < m) {
          var M = Ge(wt(u.implementationType));
          throw new Error(M);
        }
      }
      g.forEach(function(N) {
        On(e, !1, N.serviceIdentifier, r, h, N);
      });
    }
  });
}
o(On, "_createSubRequests");
function ut(e, t) {
  var n = [], r = pt(e);
  return r.hasKey(t) ? n = r.get(t) : e.parent !== null && (n = ut(e.parent, t)), n;
}
o(ut, "getBindings");
function fr(e, t, n, r, i, a, f, d) {
  d === void 0 && (d = !1);
  var v = new Tn(t), u = sr(n, r, i, "", a, f);
  try {
    return On(e, d, i, v, null, u), v;
  } catch (h) {
    throw bn(h) && An(v.plan.rootRequest), h;
  }
}
o(fr, "plan");
function lr(e, t, n, r) {
  var i = new bt(ct.Variable, "", t, new Q(n, r)), a = new Tn(e), f = new Pt(t, a, null, [], i);
  return f;
}
o(lr, "createMockRequest");
function F(e) {
  var t = typeof e == "object" && e !== null || typeof e == "function";
  return t && typeof e.then == "function";
}
o(F, "isPromise");
function Cn(e) {
  return F(e) ? !0 : Array.isArray(e) && e.some(F);
}
o(Cn, "isPromiseOrContainsPromise");
var dr = function(e, t, n, r) {
  function i(a) {
    return a instanceof n ? a : new n(function(f) {
      f(a);
    });
  }
  return o(i, "adopt"), new (n || (n = Promise))(function(a, f) {
    function d(h) {
      try {
        u(r.next(h));
      } catch (g) {
        f(g);
      }
    }
    o(d, "fulfilled");
    function v(h) {
      try {
        u(r.throw(h));
      } catch (g) {
        f(g);
      }
    }
    o(v, "rejected");
    function u(h) {
      h.done ? a(h.value) : i(h.value).then(d, v);
    }
    o(u, "step"), u((r = r.apply(e, t || [])).next());
  });
}, hr = function(e, t) {
  var n = { label: 0, sent: function() {
    if (a[0] & 1)
      throw a[1];
    return a[1];
  }, trys: [], ops: [] }, r, i, a, f;
  return f = { next: d(0), throw: d(1), return: d(2) }, typeof Symbol == "function" && (f[Symbol.iterator] = function() {
    return this;
  }), f;
  function d(u) {
    return function(h) {
      return v([u, h]);
    };
  }
  function v(u) {
    if (r)
      throw new TypeError("Generator is already executing.");
    for (; n; )
      try {
        if (r = 1, i && (a = u[0] & 2 ? i.return : u[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, u[1])).done)
          return a;
        switch (i = 0, a && (u = [u[0] & 2, a.value]), u[0]) {
          case 0:
          case 1:
            a = u;
            break;
          case 4:
            return n.label++, { value: u[1], done: !1 };
          case 5:
            n.label++, i = u[1], u = [0];
            continue;
          case 7:
            u = n.ops.pop(), n.trys.pop();
            continue;
          default:
            if (a = n.trys, !(a = a.length > 0 && a[a.length - 1]) && (u[0] === 6 || u[0] === 2)) {
              n = 0;
              continue;
            }
            if (u[0] === 3 && (!a || u[1] > a[0] && u[1] < a[3])) {
              n.label = u[1];
              break;
            }
            if (u[0] === 6 && n.label < a[1]) {
              n.label = a[1], a = u;
              break;
            }
            if (a && n.label < a[2]) {
              n.label = a[2], n.ops.push(u);
              break;
            }
            a[2] && n.ops.pop(), n.trys.pop();
            continue;
        }
        u = t.call(e, n);
      } catch (h) {
        u = [6, h], i = 0;
      } finally {
        r = a = 0;
      }
    if (u[0] & 5)
      throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}, pr = /* @__PURE__ */ o(function(e, t) {
  return t.scope === R.Singleton && t.activated ? t.cache : t.scope === R.Request && e.has(t.id) ? e.get(t.id) : null;
}, "tryGetFromScope"), vr = /* @__PURE__ */ o(function(e, t, n) {
  t.scope === R.Singleton && gr(t, n), t.scope === R.Request && yr(e, t, n);
}, "saveToScope"), yr = /* @__PURE__ */ o(function(e, t, n) {
  e.has(t.id) || e.set(t.id, n);
}, "_saveToRequestScope"), gr = /* @__PURE__ */ o(function(e, t) {
  e.cache = t, e.activated = !0, F(t) && _r(e, t);
}, "_saveToSingletonScope"), _r = /* @__PURE__ */ o(function(e, t) {
  return dr(void 0, void 0, void 0, function() {
    var n, r;
    return hr(this, function(i) {
      switch (i.label) {
        case 0:
          return i.trys.push([0, 2, , 3]), [4, t];
        case 1:
          return n = i.sent(), e.cache = n, [3, 3];
        case 2:
          throw r = i.sent(), e.cache = null, e.activated = !1, r;
        case 3:
          return [2];
      }
    });
  });
}, "_saveAsyncResultToSingletonScope"), rt;
(function(e) {
  e.DynamicValue = "toDynamicValue", e.Factory = "toFactory", e.Provider = "toProvider";
})(rt || (rt = {}));
var wr = /* @__PURE__ */ o(function(e) {
  var t = null;
  switch (e.type) {
    case C.ConstantValue:
    case C.Function:
      t = e.cache;
      break;
    case C.Constructor:
    case C.Instance:
      t = e.implementationType;
      break;
    case C.DynamicValue:
      t = e.dynamicValue;
      break;
    case C.Provider:
      t = e.provider;
      break;
    case C.Factory:
      t = e.factory;
      break;
  }
  if (t === null) {
    var n = ot(e.serviceIdentifier);
    throw new Error(Re + " " + n);
  }
}, "ensureFullyBound"), br = /* @__PURE__ */ o(function(e) {
  switch (e.type) {
    case C.Factory:
      return { factory: e.factory, factoryType: rt.Factory };
    case C.Provider:
      return { factory: e.provider, factoryType: rt.Provider };
    case C.DynamicValue:
      return { factory: e.dynamicValue, factoryType: rt.DynamicValue };
    default:
      throw new Error("Unexpected factory type " + e.type);
  }
}, "getFactoryDetails"), z = function() {
  return z = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t)
        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, z.apply(this, arguments);
}, Nn = function(e, t, n, r) {
  function i(a) {
    return a instanceof n ? a : new n(function(f) {
      f(a);
    });
  }
  return o(i, "adopt"), new (n || (n = Promise))(function(a, f) {
    function d(h) {
      try {
        u(r.next(h));
      } catch (g) {
        f(g);
      }
    }
    o(d, "fulfilled");
    function v(h) {
      try {
        u(r.throw(h));
      } catch (g) {
        f(g);
      }
    }
    o(v, "rejected");
    function u(h) {
      h.done ? a(h.value) : i(h.value).then(d, v);
    }
    o(u, "step"), u((r = r.apply(e, t || [])).next());
  });
}, Dn = function(e, t) {
  var n = { label: 0, sent: function() {
    if (a[0] & 1)
      throw a[1];
    return a[1];
  }, trys: [], ops: [] }, r, i, a, f;
  return f = { next: d(0), throw: d(1), return: d(2) }, typeof Symbol == "function" && (f[Symbol.iterator] = function() {
    return this;
  }), f;
  function d(u) {
    return function(h) {
      return v([u, h]);
    };
  }
  function v(u) {
    if (r)
      throw new TypeError("Generator is already executing.");
    for (; n; )
      try {
        if (r = 1, i && (a = u[0] & 2 ? i.return : u[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, u[1])).done)
          return a;
        switch (i = 0, a && (u = [u[0] & 2, a.value]), u[0]) {
          case 0:
          case 1:
            a = u;
            break;
          case 4:
            return n.label++, { value: u[1], done: !1 };
          case 5:
            n.label++, i = u[1], u = [0];
            continue;
          case 7:
            u = n.ops.pop(), n.trys.pop();
            continue;
          default:
            if (a = n.trys, !(a = a.length > 0 && a[a.length - 1]) && (u[0] === 6 || u[0] === 2)) {
              n = 0;
              continue;
            }
            if (u[0] === 3 && (!a || u[1] > a[0] && u[1] < a[3])) {
              n.label = u[1];
              break;
            }
            if (u[0] === 6 && n.label < a[1]) {
              n.label = a[1], a = u;
              break;
            }
            if (a && n.label < a[2]) {
              n.label = a[2], n.ops.push(u);
              break;
            }
            a[2] && n.ops.pop(), n.trys.pop();
            continue;
        }
        u = t.call(e, n);
      } catch (h) {
        u = [6, h], i = 0;
      } finally {
        r = a = 0;
      }
    if (u[0] & 5)
      throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}, mr = function(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, i = t.length, a; r < i; r++)
      (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
};
function Ar(e, t) {
  return e.reduce(function(n, r) {
    var i = t(r), a = r.target.type;
    return a === ct.ConstructorArgument ? n.constructorInjections.push(i) : (n.propertyRequests.push(r), n.propertyInjections.push(i)), n.isAsync || (n.isAsync = Cn(i)), n;
  }, { constructorInjections: [], propertyInjections: [], propertyRequests: [], isAsync: !1 });
}
o(Ar, "_resolveRequests");
function Tr(e, t, n) {
  var r;
  if (t.length > 0) {
    var i = Ar(t, n), a = z(z({}, i), { constr: e });
    i.isAsync ? r = Sr(a) : r = kn(a);
  } else
    r = new e();
  return r;
}
o(Tr, "_createInstance");
function kn(e) {
  var t, n = new ((t = e.constr).bind.apply(t, mr([void 0], e.constructorInjections, !1)))();
  return e.propertyRequests.forEach(function(r, i) {
    var a = r.target.identifier, f = e.propertyInjections[i];
    (!r.target.isOptional() || f !== void 0) && (n[a] = f);
  }), n;
}
o(kn, "createInstanceWithInjections");
function Sr(e) {
  return Nn(this, void 0, void 0, function() {
    var t, n;
    return Dn(this, function(r) {
      switch (r.label) {
        case 0:
          return [4, cn(e.constructorInjections)];
        case 1:
          return t = r.sent(), [4, cn(e.propertyInjections)];
        case 2:
          return n = r.sent(), [2, kn(z(z({}, e), { constructorInjections: t, propertyInjections: n }))];
      }
    });
  });
}
o(Sr, "createInstanceWithInjectionsAsync");
function cn(e) {
  return Nn(this, void 0, void 0, function() {
    var t, n, r, i;
    return Dn(this, function(a) {
      for (t = [], n = 0, r = e; n < r.length; n++)
        i = r[n], Array.isArray(i) ? t.push(Promise.all(i)) : t.push(i);
      return [2, Promise.all(t)];
    });
  });
}
o(cn, "possiblyWaitInjections");
function fn(e, t) {
  var n = Ir(e, t);
  return F(n) ? n.then(function() {
    return t;
  }) : t;
}
o(fn, "_getInstanceAfterPostConstruct");
function Ir(e, t) {
  var n, r;
  if (Reflect.hasMetadata(rn, e)) {
    var i = Reflect.getMetadata(rn, e);
    try {
      return (r = (n = t)[i.value]) === null || r === void 0 ? void 0 : r.call(n);
    } catch (a) {
      if (a instanceof Error)
        throw new Error($e(e.name, a.message));
    }
  }
}
o(Ir, "_postConstruct");
function Mr(e, t) {
  e.scope !== R.Singleton && Er(e, t);
}
o(Mr, "_validateInstanceResolution");
function Er(e, t) {
  var n = "Class cannot be instantiated in " + (e.scope === R.Request ? "request" : "transient") + " scope.";
  if (typeof e.onDeactivation == "function")
    throw new Error(Ot(t.name, n));
  if (Reflect.hasMetadata(Et, t))
    throw new Error(Je(t.name, n));
}
o(Er, "_throwIfHandlingDeactivation");
function Or(e, t, n, r) {
  Mr(e, t);
  var i = Tr(t, n, r);
  return F(i) ? i.then(function(a) {
    return fn(t, a);
  }) : fn(t, i);
}
o(Or, "resolveInstance");
var Cr = function(e, t, n, r) {
  function i(a) {
    return a instanceof n ? a : new n(function(f) {
      f(a);
    });
  }
  return o(i, "adopt"), new (n || (n = Promise))(function(a, f) {
    function d(h) {
      try {
        u(r.next(h));
      } catch (g) {
        f(g);
      }
    }
    o(d, "fulfilled");
    function v(h) {
      try {
        u(r.throw(h));
      } catch (g) {
        f(g);
      }
    }
    o(v, "rejected");
    function u(h) {
      h.done ? a(h.value) : i(h.value).then(d, v);
    }
    o(u, "step"), u((r = r.apply(e, t || [])).next());
  });
}, Nr = function(e, t) {
  var n = { label: 0, sent: function() {
    if (a[0] & 1)
      throw a[1];
    return a[1];
  }, trys: [], ops: [] }, r, i, a, f;
  return f = { next: d(0), throw: d(1), return: d(2) }, typeof Symbol == "function" && (f[Symbol.iterator] = function() {
    return this;
  }), f;
  function d(u) {
    return function(h) {
      return v([u, h]);
    };
  }
  function v(u) {
    if (r)
      throw new TypeError("Generator is already executing.");
    for (; n; )
      try {
        if (r = 1, i && (a = u[0] & 2 ? i.return : u[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, u[1])).done)
          return a;
        switch (i = 0, a && (u = [u[0] & 2, a.value]), u[0]) {
          case 0:
          case 1:
            a = u;
            break;
          case 4:
            return n.label++, { value: u[1], done: !1 };
          case 5:
            n.label++, i = u[1], u = [0];
            continue;
          case 7:
            u = n.ops.pop(), n.trys.pop();
            continue;
          default:
            if (a = n.trys, !(a = a.length > 0 && a[a.length - 1]) && (u[0] === 6 || u[0] === 2)) {
              n = 0;
              continue;
            }
            if (u[0] === 3 && (!a || u[1] > a[0] && u[1] < a[3])) {
              n.label = u[1];
              break;
            }
            if (u[0] === 6 && n.label < a[1]) {
              n.label = a[1], a = u;
              break;
            }
            if (a && n.label < a[2]) {
              n.label = a[2], n.ops.push(u);
              break;
            }
            a[2] && n.ops.pop(), n.trys.pop();
            continue;
        }
        u = t.call(e, n);
      } catch (h) {
        u = [6, h], i = 0;
      } finally {
        r = a = 0;
      }
    if (u[0] & 5)
      throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}, Rt = /* @__PURE__ */ o(function(e) {
  return function(t) {
    t.parentContext.setCurrentRequest(t);
    var n = t.bindings, r = t.childRequests, i = t.target && t.target.isArray(), a = !t.parentRequest || !t.parentRequest.target || !t.target || !t.parentRequest.target.matchesArray(t.target.serviceIdentifier);
    if (i && a)
      return r.map(function(d) {
        var v = Rt(e);
        return v(d);
      });
    if (t.target.isOptional() && n.length === 0)
      return;
    var f = n[0];
    return Rr(e, t, f);
  };
}, "_resolveRequest"), Dr = /* @__PURE__ */ o(function(e, t) {
  var n = br(e);
  return Ze(function() {
    return n.factory.bind(e)(t);
  }, function() {
    return new Error(Ke(n.factoryType, t.currentRequest.serviceIdentifier.toString()));
  });
}, "_resolveFactoryFromBinding"), kr = /* @__PURE__ */ o(function(e, t, n) {
  var r, i = t.childRequests;
  switch (wr(n), n.type) {
    case C.ConstantValue:
    case C.Function:
      r = n.cache;
      break;
    case C.Constructor:
      r = n.implementationType;
      break;
    case C.Instance:
      r = Or(n, n.implementationType, i, Rt(e));
      break;
    default:
      r = Dr(n, t.parentContext);
  }
  return r;
}, "_getResolvedFromBinding"), Pr = /* @__PURE__ */ o(function(e, t, n) {
  var r = pr(e, t);
  return r !== null || (r = n(), vr(e, t, r)), r;
}, "_resolveInScope"), Rr = /* @__PURE__ */ o(function(e, t, n) {
  return Pr(e, n, function() {
    var r = kr(e, t, n);
    return F(r) ? r = r.then(function(i) {
      return ln(t, n, i);
    }) : r = ln(t, n, r), r;
  });
}, "_resolveBinding");
function ln(e, t, n) {
  var r = xr(e.parentContext, t, n), i = Fr(e.parentContext.container), a, f = i.next();
  do {
    a = f.value;
    var d = e.parentContext, v = e.serviceIdentifier, u = Br(a, v);
    F(r) ? r = Pn(u, d, r) : r = jr(u, d, r), f = i.next();
  } while (f.done !== !0 && !pt(a).hasKey(e.serviceIdentifier));
  return r;
}
o(ln, "_onActivation");
var xr = /* @__PURE__ */ o(function(e, t, n) {
  var r;
  return typeof t.onActivation == "function" ? r = t.onActivation(e, n) : r = n, r;
}, "_bindingActivation"), jr = /* @__PURE__ */ o(function(e, t, n) {
  for (var r = e.next(); !r.done; ) {
    if (n = r.value(t, n), F(n))
      return Pn(e, t, n);
    r = e.next();
  }
  return n;
}, "_activateContainer"), Pn = /* @__PURE__ */ o(function(e, t, n) {
  return Cr(void 0, void 0, void 0, function() {
    var r, i;
    return Nr(this, function(a) {
      switch (a.label) {
        case 0:
          return [4, n];
        case 1:
          r = a.sent(), i = e.next(), a.label = 2;
        case 2:
          return i.done ? [3, 4] : [4, i.value(t, r)];
        case 3:
          return r = a.sent(), i = e.next(), [3, 2];
        case 4:
          return [2, r];
      }
    });
  });
}, "_activateContainerAsync"), Br = /* @__PURE__ */ o(function(e, t) {
  var n = e._activations;
  return n.hasKey(t) ? n.get(t).values() : [].values();
}, "_getContainerActivationsForService"), Fr = /* @__PURE__ */ o(function(e) {
  for (var t = [e], n = e.parent; n !== null; )
    t.push(n), n = n.parent;
  var r = /* @__PURE__ */ o(function() {
    var a = t.pop();
    return a !== void 0 ? { done: !1, value: a } : { done: !0, value: void 0 };
  }, "getNextContainer"), i = {
    next: r
  };
  return i;
}, "_getContainersIterator");
function Wr(e) {
  var t = Rt(e.plan.rootRequest.requestScope);
  return t(e.plan.rootRequest);
}
o(Wr, "resolve");
var Y = /* @__PURE__ */ o(function(e, t) {
  var n = e.parentRequest;
  return n !== null ? t(n) ? !0 : Y(n, t) : !1;
}, "traverseAncerstors"), et = /* @__PURE__ */ o(function(e) {
  return function(t) {
    var n = /* @__PURE__ */ o(function(r) {
      return r !== null && r.target !== null && r.target.matchesTag(e)(t);
    }, "constraint");
    return n.metaData = new Q(e, t), n;
  };
}, "taggedConstraint"), lt = et(U), It = /* @__PURE__ */ o(function(e) {
  return function(t) {
    var n = null;
    if (t !== null)
      if (n = t.bindings[0], typeof e == "string") {
        var r = n.serviceIdentifier;
        return r === e;
      } else {
        var i = t.bindings[0].implementationType;
        return e === i;
      }
    return !1;
  };
}, "typeConstraint"), vt = function() {
  function e(t) {
    this._binding = t;
  }
  return o(e, "BindingWhenSyntax"), e.prototype.when = function(t) {
    return this._binding.constraint = t, new B(this._binding);
  }, e.prototype.whenTargetNamed = function(t) {
    return this._binding.constraint = lt(t), new B(this._binding);
  }, e.prototype.whenTargetIsDefault = function() {
    return this._binding.constraint = function(t) {
      if (t === null)
        return !1;
      var n = t.target !== null && !t.target.isNamed() && !t.target.isTagged();
      return n;
    }, new B(this._binding);
  }, e.prototype.whenTargetTagged = function(t, n) {
    return this._binding.constraint = et(t)(n), new B(this._binding);
  }, e.prototype.whenInjectedInto = function(t) {
    return this._binding.constraint = function(n) {
      return n !== null && It(t)(n.parentRequest);
    }, new B(this._binding);
  }, e.prototype.whenParentNamed = function(t) {
    return this._binding.constraint = function(n) {
      return n !== null && lt(t)(n.parentRequest);
    }, new B(this._binding);
  }, e.prototype.whenParentTagged = function(t, n) {
    return this._binding.constraint = function(r) {
      return r !== null && et(t)(n)(r.parentRequest);
    }, new B(this._binding);
  }, e.prototype.whenAnyAncestorIs = function(t) {
    return this._binding.constraint = function(n) {
      return n !== null && Y(n, It(t));
    }, new B(this._binding);
  }, e.prototype.whenNoAncestorIs = function(t) {
    return this._binding.constraint = function(n) {
      return n !== null && !Y(n, It(t));
    }, new B(this._binding);
  }, e.prototype.whenAnyAncestorNamed = function(t) {
    return this._binding.constraint = function(n) {
      return n !== null && Y(n, lt(t));
    }, new B(this._binding);
  }, e.prototype.whenNoAncestorNamed = function(t) {
    return this._binding.constraint = function(n) {
      return n !== null && !Y(n, lt(t));
    }, new B(this._binding);
  }, e.prototype.whenAnyAncestorTagged = function(t, n) {
    return this._binding.constraint = function(r) {
      return r !== null && Y(r, et(t)(n));
    }, new B(this._binding);
  }, e.prototype.whenNoAncestorTagged = function(t, n) {
    return this._binding.constraint = function(r) {
      return r !== null && !Y(r, et(t)(n));
    }, new B(this._binding);
  }, e.prototype.whenAnyAncestorMatches = function(t) {
    return this._binding.constraint = function(n) {
      return n !== null && Y(n, t);
    }, new B(this._binding);
  }, e.prototype.whenNoAncestorMatches = function(t) {
    return this._binding.constraint = function(n) {
      return n !== null && !Y(n, t);
    }, new B(this._binding);
  }, e;
}(), B = function() {
  function e(t) {
    this._binding = t;
  }
  return o(e, "BindingOnSyntax"), e.prototype.onActivation = function(t) {
    return this._binding.onActivation = t, new vt(this._binding);
  }, e.prototype.onDeactivation = function(t) {
    return this._binding.onDeactivation = t, new vt(this._binding);
  }, e;
}(), $ = function() {
  function e(t) {
    this._binding = t, this._bindingWhenSyntax = new vt(this._binding), this._bindingOnSyntax = new B(this._binding);
  }
  return o(e, "BindingWhenOnSyntax"), e.prototype.when = function(t) {
    return this._bindingWhenSyntax.when(t);
  }, e.prototype.whenTargetNamed = function(t) {
    return this._bindingWhenSyntax.whenTargetNamed(t);
  }, e.prototype.whenTargetIsDefault = function() {
    return this._bindingWhenSyntax.whenTargetIsDefault();
  }, e.prototype.whenTargetTagged = function(t, n) {
    return this._bindingWhenSyntax.whenTargetTagged(t, n);
  }, e.prototype.whenInjectedInto = function(t) {
    return this._bindingWhenSyntax.whenInjectedInto(t);
  }, e.prototype.whenParentNamed = function(t) {
    return this._bindingWhenSyntax.whenParentNamed(t);
  }, e.prototype.whenParentTagged = function(t, n) {
    return this._bindingWhenSyntax.whenParentTagged(t, n);
  }, e.prototype.whenAnyAncestorIs = function(t) {
    return this._bindingWhenSyntax.whenAnyAncestorIs(t);
  }, e.prototype.whenNoAncestorIs = function(t) {
    return this._bindingWhenSyntax.whenNoAncestorIs(t);
  }, e.prototype.whenAnyAncestorNamed = function(t) {
    return this._bindingWhenSyntax.whenAnyAncestorNamed(t);
  }, e.prototype.whenAnyAncestorTagged = function(t, n) {
    return this._bindingWhenSyntax.whenAnyAncestorTagged(t, n);
  }, e.prototype.whenNoAncestorNamed = function(t) {
    return this._bindingWhenSyntax.whenNoAncestorNamed(t);
  }, e.prototype.whenNoAncestorTagged = function(t, n) {
    return this._bindingWhenSyntax.whenNoAncestorTagged(t, n);
  }, e.prototype.whenAnyAncestorMatches = function(t) {
    return this._bindingWhenSyntax.whenAnyAncestorMatches(t);
  }, e.prototype.whenNoAncestorMatches = function(t) {
    return this._bindingWhenSyntax.whenNoAncestorMatches(t);
  }, e.prototype.onActivation = function(t) {
    return this._bindingOnSyntax.onActivation(t);
  }, e.prototype.onDeactivation = function(t) {
    return this._bindingOnSyntax.onDeactivation(t);
  }, e;
}(), Gr = function() {
  function e(t) {
    this._binding = t;
  }
  return o(e, "BindingInSyntax"), e.prototype.inRequestScope = function() {
    return this._binding.scope = R.Request, new $(this._binding);
  }, e.prototype.inSingletonScope = function() {
    return this._binding.scope = R.Singleton, new $(this._binding);
  }, e.prototype.inTransientScope = function() {
    return this._binding.scope = R.Transient, new $(this._binding);
  }, e;
}(), dn = function() {
  function e(t) {
    this._binding = t, this._bindingWhenSyntax = new vt(this._binding), this._bindingOnSyntax = new B(this._binding), this._bindingInSyntax = new Gr(t);
  }
  return o(e, "BindingInWhenOnSyntax"), e.prototype.inRequestScope = function() {
    return this._bindingInSyntax.inRequestScope();
  }, e.prototype.inSingletonScope = function() {
    return this._bindingInSyntax.inSingletonScope();
  }, e.prototype.inTransientScope = function() {
    return this._bindingInSyntax.inTransientScope();
  }, e.prototype.when = function(t) {
    return this._bindingWhenSyntax.when(t);
  }, e.prototype.whenTargetNamed = function(t) {
    return this._bindingWhenSyntax.whenTargetNamed(t);
  }, e.prototype.whenTargetIsDefault = function() {
    return this._bindingWhenSyntax.whenTargetIsDefault();
  }, e.prototype.whenTargetTagged = function(t, n) {
    return this._bindingWhenSyntax.whenTargetTagged(t, n);
  }, e.prototype.whenInjectedInto = function(t) {
    return this._bindingWhenSyntax.whenInjectedInto(t);
  }, e.prototype.whenParentNamed = function(t) {
    return this._bindingWhenSyntax.whenParentNamed(t);
  }, e.prototype.whenParentTagged = function(t, n) {
    return this._bindingWhenSyntax.whenParentTagged(t, n);
  }, e.prototype.whenAnyAncestorIs = function(t) {
    return this._bindingWhenSyntax.whenAnyAncestorIs(t);
  }, e.prototype.whenNoAncestorIs = function(t) {
    return this._bindingWhenSyntax.whenNoAncestorIs(t);
  }, e.prototype.whenAnyAncestorNamed = function(t) {
    return this._bindingWhenSyntax.whenAnyAncestorNamed(t);
  }, e.prototype.whenAnyAncestorTagged = function(t, n) {
    return this._bindingWhenSyntax.whenAnyAncestorTagged(t, n);
  }, e.prototype.whenNoAncestorNamed = function(t) {
    return this._bindingWhenSyntax.whenNoAncestorNamed(t);
  }, e.prototype.whenNoAncestorTagged = function(t, n) {
    return this._bindingWhenSyntax.whenNoAncestorTagged(t, n);
  }, e.prototype.whenAnyAncestorMatches = function(t) {
    return this._bindingWhenSyntax.whenAnyAncestorMatches(t);
  }, e.prototype.whenNoAncestorMatches = function(t) {
    return this._bindingWhenSyntax.whenNoAncestorMatches(t);
  }, e.prototype.onActivation = function(t) {
    return this._bindingOnSyntax.onActivation(t);
  }, e.prototype.onDeactivation = function(t) {
    return this._bindingOnSyntax.onDeactivation(t);
  }, e;
}(), Ur = function() {
  function e(t) {
    this._binding = t;
  }
  return o(e, "BindingToSyntax"), e.prototype.to = function(t) {
    return this._binding.type = C.Instance, this._binding.implementationType = t, new dn(this._binding);
  }, e.prototype.toSelf = function() {
    if (typeof this._binding.serviceIdentifier != "function")
      throw new Error("" + We);
    var t = this._binding.serviceIdentifier;
    return this.to(t);
  }, e.prototype.toConstantValue = function(t) {
    return this._binding.type = C.ConstantValue, this._binding.cache = t, this._binding.dynamicValue = null, this._binding.implementationType = null, this._binding.scope = R.Singleton, new $(this._binding);
  }, e.prototype.toDynamicValue = function(t) {
    return this._binding.type = C.DynamicValue, this._binding.cache = null, this._binding.dynamicValue = t, this._binding.implementationType = null, new dn(this._binding);
  }, e.prototype.toConstructor = function(t) {
    return this._binding.type = C.Constructor, this._binding.implementationType = t, this._binding.scope = R.Singleton, new $(this._binding);
  }, e.prototype.toFactory = function(t) {
    return this._binding.type = C.Factory, this._binding.factory = t, this._binding.scope = R.Singleton, new $(this._binding);
  }, e.prototype.toFunction = function(t) {
    if (typeof t != "function")
      throw new Error(Be);
    var n = this.toConstantValue(t);
    return this._binding.type = C.Function, this._binding.scope = R.Singleton, n;
  }, e.prototype.toAutoFactory = function(t) {
    return this._binding.type = C.Factory, this._binding.factory = function(n) {
      var r = /* @__PURE__ */ o(function() {
        return n.container.get(t);
      }, "autofactory");
      return r;
    }, this._binding.scope = R.Singleton, new $(this._binding);
  }, e.prototype.toAutoNamedFactory = function(t) {
    return this._binding.type = C.Factory, this._binding.factory = function(n) {
      return function(r) {
        return n.container.getNamed(t, r);
      };
    }, new $(this._binding);
  }, e.prototype.toProvider = function(t) {
    return this._binding.type = C.Provider, this._binding.provider = t, this._binding.scope = R.Singleton, new $(this._binding);
  }, e.prototype.toService = function(t) {
    this.toDynamicValue(function(n) {
      return n.container.get(t);
    });
  }, e;
}(), Vr = function() {
  function e() {
  }
  return o(e, "ContainerSnapshot"), e.of = function(t, n, r, i, a) {
    var f = new e();
    return f.bindings = t, f.middleware = n, f.deactivations = i, f.activations = r, f.moduleActivationStore = a, f;
  }, e;
}();
function Lr(e) {
  return typeof e == "object" && e !== null && "clone" in e && typeof e.clone == "function";
}
o(Lr, "isClonable");
var q = function() {
  function e() {
    this._map = /* @__PURE__ */ new Map();
  }
  return o(e, "Lookup"), e.prototype.getMap = function() {
    return this._map;
  }, e.prototype.add = function(t, n) {
    if (t == null)
      throw new Error(nt);
    if (n == null)
      throw new Error(nt);
    var r = this._map.get(t);
    r !== void 0 ? r.push(n) : this._map.set(t, [n]);
  }, e.prototype.get = function(t) {
    if (t == null)
      throw new Error(nt);
    var n = this._map.get(t);
    if (n !== void 0)
      return n;
    throw new Error(on);
  }, e.prototype.remove = function(t) {
    if (t == null)
      throw new Error(nt);
    if (!this._map.delete(t))
      throw new Error(on);
  }, e.prototype.removeIntersection = function(t) {
    var n = this;
    this.traverse(function(r, i) {
      var a = t.hasKey(r) ? t.get(r) : void 0;
      if (a !== void 0) {
        var f = i.filter(function(d) {
          return !a.some(function(v) {
            return d === v;
          });
        });
        n._setValue(r, f);
      }
    });
  }, e.prototype.removeByCondition = function(t) {
    var n = this, r = [];
    return this._map.forEach(function(i, a) {
      for (var f = [], d = 0, v = i; d < v.length; d++) {
        var u = v[d], h = t(u);
        h ? r.push(u) : f.push(u);
      }
      n._setValue(a, f);
    }), r;
  }, e.prototype.hasKey = function(t) {
    if (t == null)
      throw new Error(nt);
    return this._map.has(t);
  }, e.prototype.clone = function() {
    var t = new e();
    return this._map.forEach(function(n, r) {
      n.forEach(function(i) {
        return t.add(r, Lr(i) ? i.clone() : i);
      });
    }), t;
  }, e.prototype.traverse = function(t) {
    this._map.forEach(function(n, r) {
      t(r, n);
    });
  }, e.prototype._setValue = function(t, n) {
    n.length > 0 ? this._map.set(t, n) : this._map.delete(t);
  }, e;
}(), Hr = function() {
  function e() {
    this._map = /* @__PURE__ */ new Map();
  }
  return o(e, "ModuleActivationStore"), e.prototype.remove = function(t) {
    if (this._map.has(t)) {
      var n = this._map.get(t);
      return this._map.delete(t), n;
    }
    return this._getEmptyHandlersStore();
  }, e.prototype.addDeactivation = function(t, n, r) {
    this._getModuleActivationHandlers(t).onDeactivations.add(n, r);
  }, e.prototype.addActivation = function(t, n, r) {
    this._getModuleActivationHandlers(t).onActivations.add(n, r);
  }, e.prototype.clone = function() {
    var t = new e();
    return this._map.forEach(function(n, r) {
      t._map.set(r, {
        onActivations: n.onActivations.clone(),
        onDeactivations: n.onDeactivations.clone()
      });
    }), t;
  }, e.prototype._getModuleActivationHandlers = function(t) {
    var n = this._map.get(t);
    return n === void 0 && (n = this._getEmptyHandlersStore(), this._map.set(t, n)), n;
  }, e.prototype._getEmptyHandlersStore = function() {
    var t = {
      onActivations: new q(),
      onDeactivations: new q()
    };
    return t;
  }, e;
}(), yt = function() {
  return yt = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++) {
      t = arguments[n];
      for (var i in t)
        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, yt.apply(this, arguments);
}, W = function(e, t, n, r) {
  function i(a) {
    return a instanceof n ? a : new n(function(f) {
      f(a);
    });
  }
  return o(i, "adopt"), new (n || (n = Promise))(function(a, f) {
    function d(h) {
      try {
        u(r.next(h));
      } catch (g) {
        f(g);
      }
    }
    o(d, "fulfilled");
    function v(h) {
      try {
        u(r.throw(h));
      } catch (g) {
        f(g);
      }
    }
    o(v, "rejected");
    function u(h) {
      h.done ? a(h.value) : i(h.value).then(d, v);
    }
    o(u, "step"), u((r = r.apply(e, t || [])).next());
  });
}, G = function(e, t) {
  var n = { label: 0, sent: function() {
    if (a[0] & 1)
      throw a[1];
    return a[1];
  }, trys: [], ops: [] }, r, i, a, f;
  return f = { next: d(0), throw: d(1), return: d(2) }, typeof Symbol == "function" && (f[Symbol.iterator] = function() {
    return this;
  }), f;
  function d(u) {
    return function(h) {
      return v([u, h]);
    };
  }
  function v(u) {
    if (r)
      throw new TypeError("Generator is already executing.");
    for (; n; )
      try {
        if (r = 1, i && (a = u[0] & 2 ? i.return : u[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, u[1])).done)
          return a;
        switch (i = 0, a && (u = [u[0] & 2, a.value]), u[0]) {
          case 0:
          case 1:
            a = u;
            break;
          case 4:
            return n.label++, { value: u[1], done: !1 };
          case 5:
            n.label++, i = u[1], u = [0];
            continue;
          case 7:
            u = n.ops.pop(), n.trys.pop();
            continue;
          default:
            if (a = n.trys, !(a = a.length > 0 && a[a.length - 1]) && (u[0] === 6 || u[0] === 2)) {
              n = 0;
              continue;
            }
            if (u[0] === 3 && (!a || u[1] > a[0] && u[1] < a[3])) {
              n.label = u[1];
              break;
            }
            if (u[0] === 6 && n.label < a[1]) {
              n.label = a[1], a = u;
              break;
            }
            if (a && n.label < a[2]) {
              n.label = a[2], n.ops.push(u);
              break;
            }
            a[2] && n.ops.pop(), n.trys.pop();
            continue;
        }
        u = t.call(e, n);
      } catch (h) {
        u = [6, h], i = 0;
      } finally {
        r = a = 0;
      }
    if (u[0] & 5)
      throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}, Yr = function(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, i = t.length, a; r < i; r++)
      (a || !(r in t)) && (a || (a = Array.prototype.slice.call(t, 0, r)), a[r] = t[r]);
  return e.concat(a || Array.prototype.slice.call(t));
}, $r = function() {
  function e(t) {
    var n = t || {};
    if (typeof n != "object")
      throw new Error("" + Ue);
    if (n.defaultScope === void 0)
      n.defaultScope = R.Transient;
    else if (n.defaultScope !== R.Singleton && n.defaultScope !== R.Transient && n.defaultScope !== R.Request)
      throw new Error("" + Ve);
    if (n.autoBindInjectable === void 0)
      n.autoBindInjectable = !1;
    else if (typeof n.autoBindInjectable != "boolean")
      throw new Error("" + Le);
    if (n.skipBaseClassChecks === void 0)
      n.skipBaseClassChecks = !1;
    else if (typeof n.skipBaseClassChecks != "boolean")
      throw new Error("" + He);
    this.options = {
      autoBindInjectable: n.autoBindInjectable,
      defaultScope: n.defaultScope,
      skipBaseClassChecks: n.skipBaseClassChecks
    }, this.id = ft(), this._bindingDictionary = new q(), this._snapshots = [], this._middleware = null, this._activations = new q(), this._deactivations = new q(), this.parent = null, this._metadataReader = new Qe(), this._moduleActivationStore = new Hr();
  }
  return o(e, "Container"), e.merge = function(t, n) {
    for (var r = [], i = 2; i < arguments.length; i++)
      r[i - 2] = arguments[i];
    var a = new e(), f = Yr([t, n], r, !0).map(function(u) {
      return pt(u);
    }), d = pt(a);
    function v(u, h) {
      u.traverse(function(g, m) {
        m.forEach(function(M) {
          h.add(M.serviceIdentifier, M.clone());
        });
      });
    }
    return o(v, "copyDictionary"), f.forEach(function(u) {
      v(u, d);
    }), a;
  }, e.prototype.load = function() {
    for (var t = [], n = 0; n < arguments.length; n++)
      t[n] = arguments[n];
    for (var r = this._getContainerModuleHelpersFactory(), i = 0, a = t; i < a.length; i++) {
      var f = a[i], d = r(f.id);
      f.registry(d.bindFunction, d.unbindFunction, d.isboundFunction, d.rebindFunction, d.unbindAsyncFunction, d.onActivationFunction, d.onDeactivationFunction);
    }
  }, e.prototype.loadAsync = function() {
    for (var t = [], n = 0; n < arguments.length; n++)
      t[n] = arguments[n];
    return W(this, void 0, void 0, function() {
      var r, i, a, f, d;
      return G(this, function(v) {
        switch (v.label) {
          case 0:
            r = this._getContainerModuleHelpersFactory(), i = 0, a = t, v.label = 1;
          case 1:
            return i < a.length ? (f = a[i], d = r(f.id), [4, f.registry(d.bindFunction, d.unbindFunction, d.isboundFunction, d.rebindFunction, d.unbindAsyncFunction, d.onActivationFunction, d.onDeactivationFunction)]) : [3, 4];
          case 2:
            v.sent(), v.label = 3;
          case 3:
            return i++, [3, 1];
          case 4:
            return [2];
        }
      });
    });
  }, e.prototype.unload = function() {
    for (var t = this, n = [], r = 0; r < arguments.length; r++)
      n[r] = arguments[r];
    n.forEach(function(i) {
      var a = t._removeModuleBindings(i.id);
      t._deactivateSingletons(a), t._removeModuleHandlers(i.id);
    });
  }, e.prototype.unloadAsync = function() {
    for (var t = [], n = 0; n < arguments.length; n++)
      t[n] = arguments[n];
    return W(this, void 0, void 0, function() {
      var r, i, a, f;
      return G(this, function(d) {
        switch (d.label) {
          case 0:
            r = 0, i = t, d.label = 1;
          case 1:
            return r < i.length ? (a = i[r], f = this._removeModuleBindings(a.id), [4, this._deactivateSingletonsAsync(f)]) : [3, 4];
          case 2:
            d.sent(), this._removeModuleHandlers(a.id), d.label = 3;
          case 3:
            return r++, [3, 1];
          case 4:
            return [2];
        }
      });
    });
  }, e.prototype.bind = function(t) {
    var n = this.options.defaultScope || R.Transient, r = new Me(t, n);
    return this._bindingDictionary.add(t, r), new Ur(r);
  }, e.prototype.rebind = function(t) {
    return this.unbind(t), this.bind(t);
  }, e.prototype.rebindAsync = function(t) {
    return W(this, void 0, void 0, function() {
      return G(this, function(n) {
        switch (n.label) {
          case 0:
            return [4, this.unbindAsync(t)];
          case 1:
            return n.sent(), [2, this.bind(t)];
        }
      });
    });
  }, e.prototype.unbind = function(t) {
    if (this._bindingDictionary.hasKey(t)) {
      var n = this._bindingDictionary.get(t);
      this._deactivateSingletons(n);
    }
    this._removeServiceFromDictionary(t);
  }, e.prototype.unbindAsync = function(t) {
    return W(this, void 0, void 0, function() {
      var n;
      return G(this, function(r) {
        switch (r.label) {
          case 0:
            return this._bindingDictionary.hasKey(t) ? (n = this._bindingDictionary.get(t), [4, this._deactivateSingletonsAsync(n)]) : [3, 2];
          case 1:
            r.sent(), r.label = 2;
          case 2:
            return this._removeServiceFromDictionary(t), [2];
        }
      });
    });
  }, e.prototype.unbindAll = function() {
    var t = this;
    this._bindingDictionary.traverse(function(n, r) {
      t._deactivateSingletons(r);
    }), this._bindingDictionary = new q();
  }, e.prototype.unbindAllAsync = function() {
    return W(this, void 0, void 0, function() {
      var t, n = this;
      return G(this, function(r) {
        switch (r.label) {
          case 0:
            return t = [], this._bindingDictionary.traverse(function(i, a) {
              t.push(n._deactivateSingletonsAsync(a));
            }), [4, Promise.all(t)];
          case 1:
            return r.sent(), this._bindingDictionary = new q(), [2];
        }
      });
    });
  }, e.prototype.onActivation = function(t, n) {
    this._activations.add(t, n);
  }, e.prototype.onDeactivation = function(t, n) {
    this._deactivations.add(t, n);
  }, e.prototype.isBound = function(t) {
    var n = this._bindingDictionary.hasKey(t);
    return !n && this.parent && (n = this.parent.isBound(t)), n;
  }, e.prototype.isCurrentBound = function(t) {
    return this._bindingDictionary.hasKey(t);
  }, e.prototype.isBoundNamed = function(t, n) {
    return this.isBoundTagged(t, U, n);
  }, e.prototype.isBoundTagged = function(t, n, r) {
    var i = !1;
    if (this._bindingDictionary.hasKey(t)) {
      var a = this._bindingDictionary.get(t), f = lr(this, t, n, r);
      i = a.some(function(d) {
        return d.constraint(f);
      });
    }
    return !i && this.parent && (i = this.parent.isBoundTagged(t, n, r)), i;
  }, e.prototype.snapshot = function() {
    this._snapshots.push(Vr.of(this._bindingDictionary.clone(), this._middleware, this._activations.clone(), this._deactivations.clone(), this._moduleActivationStore.clone()));
  }, e.prototype.restore = function() {
    var t = this._snapshots.pop();
    if (t === void 0)
      throw new Error(xe);
    this._bindingDictionary = t.bindings, this._activations = t.activations, this._deactivations = t.deactivations, this._middleware = t.middleware, this._moduleActivationStore = t.moduleActivationStore;
  }, e.prototype.createChild = function(t) {
    var n = new e(t || this.options);
    return n.parent = this, n;
  }, e.prototype.applyMiddleware = function() {
    for (var t = [], n = 0; n < arguments.length; n++)
      t[n] = arguments[n];
    var r = this._middleware ? this._middleware : this._planAndResolve();
    this._middleware = t.reduce(function(i, a) {
      return a(i);
    }, r);
  }, e.prototype.applyCustomMetadataReader = function(t) {
    this._metadataReader = t;
  }, e.prototype.get = function(t) {
    var n = this._getNotAllArgs(t, !1);
    return this._getButThrowIfAsync(n);
  }, e.prototype.getAsync = function(t) {
    return W(this, void 0, void 0, function() {
      var n;
      return G(this, function(r) {
        return n = this._getNotAllArgs(t, !1), [2, this._get(n)];
      });
    });
  }, e.prototype.getTagged = function(t, n, r) {
    var i = this._getNotAllArgs(t, !1, n, r);
    return this._getButThrowIfAsync(i);
  }, e.prototype.getTaggedAsync = function(t, n, r) {
    return W(this, void 0, void 0, function() {
      var i;
      return G(this, function(a) {
        return i = this._getNotAllArgs(t, !1, n, r), [2, this._get(i)];
      });
    });
  }, e.prototype.getNamed = function(t, n) {
    return this.getTagged(t, U, n);
  }, e.prototype.getNamedAsync = function(t, n) {
    return this.getTaggedAsync(t, U, n);
  }, e.prototype.getAll = function(t) {
    var n = this._getAllArgs(t);
    return this._getButThrowIfAsync(n);
  }, e.prototype.getAllAsync = function(t) {
    var n = this._getAllArgs(t);
    return this._getAll(n);
  }, e.prototype.getAllTagged = function(t, n, r) {
    var i = this._getNotAllArgs(t, !0, n, r);
    return this._getButThrowIfAsync(i);
  }, e.prototype.getAllTaggedAsync = function(t, n, r) {
    var i = this._getNotAllArgs(t, !0, n, r);
    return this._getAll(i);
  }, e.prototype.getAllNamed = function(t, n) {
    return this.getAllTagged(t, U, n);
  }, e.prototype.getAllNamedAsync = function(t, n) {
    return this.getAllTaggedAsync(t, U, n);
  }, e.prototype.resolve = function(t) {
    var n = this.isBound(t);
    n || this.bind(t).toSelf();
    var r = this.get(t);
    return n || this.unbind(t), r;
  }, e.prototype._preDestroy = function(t, n) {
    var r, i;
    if (Reflect.hasMetadata(Et, t)) {
      var a = Reflect.getMetadata(Et, t);
      return (i = (r = n)[a.value]) === null || i === void 0 ? void 0 : i.call(r);
    }
  }, e.prototype._removeModuleHandlers = function(t) {
    var n = this._moduleActivationStore.remove(t);
    this._activations.removeIntersection(n.onActivations), this._deactivations.removeIntersection(n.onDeactivations);
  }, e.prototype._removeModuleBindings = function(t) {
    return this._bindingDictionary.removeByCondition(function(n) {
      return n.moduleId === t;
    });
  }, e.prototype._deactivate = function(t, n) {
    var r = this, i = Object.getPrototypeOf(n).constructor;
    try {
      if (this._deactivations.hasKey(t.serviceIdentifier)) {
        var a = this._deactivateContainer(n, this._deactivations.get(t.serviceIdentifier).values());
        if (F(a))
          return this._handleDeactivationError(a.then(function() {
            return r._propagateContainerDeactivationThenBindingAndPreDestroyAsync(t, n, i);
          }), i);
      }
      var f = this._propagateContainerDeactivationThenBindingAndPreDestroy(t, n, i);
      if (F(f))
        return this._handleDeactivationError(f, i);
    } catch (d) {
      if (d instanceof Error)
        throw new Error(Ot(i.name, d.message));
    }
  }, e.prototype._handleDeactivationError = function(t, n) {
    return W(this, void 0, void 0, function() {
      var r;
      return G(this, function(i) {
        switch (i.label) {
          case 0:
            return i.trys.push([0, 2, , 3]), [4, t];
          case 1:
            return i.sent(), [3, 3];
          case 2:
            if (r = i.sent(), r instanceof Error)
              throw new Error(Ot(n.name, r.message));
            return [3, 3];
          case 3:
            return [2];
        }
      });
    });
  }, e.prototype._deactivateContainer = function(t, n) {
    for (var r = this, i = n.next(); i.value; ) {
      var a = i.value(t);
      if (F(a))
        return a.then(function() {
          return r._deactivateContainerAsync(t, n);
        });
      i = n.next();
    }
  }, e.prototype._deactivateContainerAsync = function(t, n) {
    return W(this, void 0, void 0, function() {
      var r;
      return G(this, function(i) {
        switch (i.label) {
          case 0:
            r = n.next(), i.label = 1;
          case 1:
            return r.value ? [4, r.value(t)] : [3, 3];
          case 2:
            return i.sent(), r = n.next(), [3, 1];
          case 3:
            return [2];
        }
      });
    });
  }, e.prototype._getContainerModuleHelpersFactory = function() {
    var t = this, n = /* @__PURE__ */ o(function(h, g) {
      h._binding.moduleId = g;
    }, "setModuleId"), r = /* @__PURE__ */ o(function(h) {
      return function(g) {
        var m = t.bind(g);
        return n(m, h), m;
      };
    }, "getBindFunction"), i = /* @__PURE__ */ o(function() {
      return function(h) {
        return t.unbind(h);
      };
    }, "getUnbindFunction"), a = /* @__PURE__ */ o(function() {
      return function(h) {
        return t.unbindAsync(h);
      };
    }, "getUnbindAsyncFunction"), f = /* @__PURE__ */ o(function() {
      return function(h) {
        return t.isBound(h);
      };
    }, "getIsboundFunction"), d = /* @__PURE__ */ o(function(h) {
      return function(g) {
        var m = t.rebind(g);
        return n(m, h), m;
      };
    }, "getRebindFunction"), v = /* @__PURE__ */ o(function(h) {
      return function(g, m) {
        t._moduleActivationStore.addActivation(h, g, m), t.onActivation(g, m);
      };
    }, "getOnActivationFunction"), u = /* @__PURE__ */ o(function(h) {
      return function(g, m) {
        t._moduleActivationStore.addDeactivation(h, g, m), t.onDeactivation(g, m);
      };
    }, "getOnDeactivationFunction");
    return function(h) {
      return {
        bindFunction: r(h),
        isboundFunction: f(),
        onActivationFunction: v(h),
        onDeactivationFunction: u(h),
        rebindFunction: d(h),
        unbindFunction: i(),
        unbindAsyncFunction: a()
      };
    };
  }, e.prototype._getAll = function(t) {
    return Promise.all(this._get(t));
  }, e.prototype._get = function(t) {
    var n = yt(yt({}, t), { contextInterceptor: function(i) {
      return i;
    }, targetType: ct.Variable });
    if (this._middleware) {
      var r = this._middleware(n);
      if (r == null)
        throw new Error(je);
      return r;
    }
    return this._planAndResolve()(n);
  }, e.prototype._getButThrowIfAsync = function(t) {
    var n = this._get(t);
    if (Cn(n))
      throw new Error(Fe(t.serviceIdentifier));
    return n;
  }, e.prototype._getAllArgs = function(t) {
    var n = {
      avoidConstraints: !0,
      isMultiInject: !0,
      serviceIdentifier: t
    };
    return n;
  }, e.prototype._getNotAllArgs = function(t, n, r, i) {
    var a = {
      avoidConstraints: !1,
      isMultiInject: n,
      serviceIdentifier: t,
      key: r,
      value: i
    };
    return a;
  }, e.prototype._planAndResolve = function() {
    var t = this;
    return function(n) {
      var r = fr(t._metadataReader, t, n.isMultiInject, n.targetType, n.serviceIdentifier, n.key, n.value, n.avoidConstraints);
      r = n.contextInterceptor(r);
      var i = Wr(r);
      return i;
    };
  }, e.prototype._deactivateIfSingleton = function(t) {
    var n = this;
    if (t.activated)
      return F(t.cache) ? t.cache.then(function(r) {
        return n._deactivate(t, r);
      }) : this._deactivate(t, t.cache);
  }, e.prototype._deactivateSingletons = function(t) {
    for (var n = 0, r = t; n < r.length; n++) {
      var i = r[n], a = this._deactivateIfSingleton(i);
      if (F(a))
        throw new Error(Ye);
    }
  }, e.prototype._deactivateSingletonsAsync = function(t) {
    return W(this, void 0, void 0, function() {
      var n = this;
      return G(this, function(r) {
        switch (r.label) {
          case 0:
            return [4, Promise.all(t.map(function(i) {
              return n._deactivateIfSingleton(i);
            }))];
          case 1:
            return r.sent(), [2];
        }
      });
    });
  }, e.prototype._propagateContainerDeactivationThenBindingAndPreDestroy = function(t, n, r) {
    return this.parent ? this._deactivate.bind(this.parent)(t, n) : this._bindingDeactivationAndPreDestroy(t, n, r);
  }, e.prototype._propagateContainerDeactivationThenBindingAndPreDestroyAsync = function(t, n, r) {
    return W(this, void 0, void 0, function() {
      return G(this, function(i) {
        switch (i.label) {
          case 0:
            return this.parent ? [4, this._deactivate.bind(this.parent)(t, n)] : [3, 2];
          case 1:
            return i.sent(), [3, 4];
          case 2:
            return [4, this._bindingDeactivationAndPreDestroyAsync(t, n, r)];
          case 3:
            i.sent(), i.label = 4;
          case 4:
            return [2];
        }
      });
    });
  }, e.prototype._removeServiceFromDictionary = function(t) {
    try {
      this._bindingDictionary.remove(t);
    } catch {
      throw new Error(Ce + " " + ot(t));
    }
  }, e.prototype._bindingDeactivationAndPreDestroy = function(t, n, r) {
    var i = this;
    if (typeof t.onDeactivation == "function") {
      var a = t.onDeactivation(n);
      if (F(a))
        return a.then(function() {
          return i._preDestroy(r, n);
        });
    }
    return this._preDestroy(r, n);
  }, e.prototype._bindingDeactivationAndPreDestroyAsync = function(t, n, r) {
    return W(this, void 0, void 0, function() {
      return G(this, function(i) {
        switch (i.label) {
          case 0:
            return typeof t.onDeactivation != "function" ? [3, 2] : [4, t.onDeactivation(n)];
          case 1:
            i.sent(), i.label = 2;
          case 2:
            return [4, this._preDestroy(r, n)];
          case 3:
            return i.sent(), [2];
        }
      });
    });
  }, e;
}();
function Jr(e) {
  for (var t = /* @__PURE__ */ new Set(), n = 0, r = e; n < r.length; n++) {
    var i = r[n];
    if (t.has(i))
      return i;
    t.add(i);
  }
}
o(Jr, "getFirstArrayDuplicate");
function Kr(e) {
  return e.prototype !== void 0;
}
o(Kr, "targetIsConstructorFunction");
function qr(e) {
  if (e !== void 0)
    throw new Error(wn);
}
o(qr, "_throwIfMethodParameter");
function Qr(e, t, n, r) {
  qr(t), Rn(vn, e, n.toString(), r);
}
o(Qr, "tagParameter");
function Zr(e, t, n) {
  if (Kr(e))
    throw new Error(wn);
  Rn(yn, e.constructor, t, n);
}
o(Zr, "tagProperty");
function Xr(e) {
  var t = [];
  if (Array.isArray(e)) {
    t = e;
    var n = Jr(t.map(function(r) {
      return r.key;
    }));
    if (n !== void 0)
      throw new Error(gn + " " + n.toString());
  } else
    t = [e];
  return t;
}
o(Xr, "_ensureNoMetadataKeyDuplicates");
function Rn(e, t, n, r) {
  var i = Xr(r), a = {};
  Reflect.hasOwnMetadata(e, t) && (a = Reflect.getMetadata(e, t));
  var f = a[n];
  if (f === void 0)
    f = [];
  else
    for (var d = /* @__PURE__ */ o(function(g) {
      if (i.some(function(m) {
        return m.key === g.key;
      }))
        throw new Error(gn + " " + g.key.toString());
    }, "_loop_1"), v = 0, u = f; v < u.length; v++) {
      var h = u[v];
      d(h);
    }
  f.push.apply(f, i), a[n] = f, Reflect.defineMetadata(e, a, t);
}
o(Rn, "_tagParameterOrProperty");
function zr(e) {
  return function(t, n, r) {
    typeof r == "number" ? Qr(t, n, r, e) : Zr(t, n, e);
  };
}
o(zr, "createTaggedDecorator");
function ti() {
  return function(e) {
    if (Reflect.hasOwnMetadata(Mt, e))
      throw new Error(Ee);
    var t = Reflect.getMetadata(Te, e) || [];
    return Reflect.defineMetadata(Mt, t, e), e;
  };
}
o(ti, "injectable");
function ni(e) {
  return function(t) {
    return function(n, r, i) {
      if (t === void 0) {
        var a = typeof n == "function" ? n.name : n.constructor.name;
        throw new Error(ke(a));
      }
      return zr(new Q(e, t))(n, r, i);
    };
  };
}
o(ni, "injectBase");
var ei = ni(_t), ri = Object.defineProperty, J = /* @__PURE__ */ o((e, t) => ri(e, "name", { value: t, configurable: !0 }), "r"), st;
((e) => {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  function r(g = "") {
    let m = n.get(g);
    return m || n.set(
      g,
      m = new $r({ skipBaseClassChecks: !0 })
    ), m;
  }
  o(r, "p"), J(r, "getContainer"), e.getContainer = r;
  function i(g) {
    let m = t.get(g.name);
    if (!m) {
      const M = [];
      let N = g;
      for (; N != null && N.name; )
        M.push(N.name), N = Object.getPrototypeOf(N);
      t.set(
        g.name,
        m = {
          singleton: !1,
          createOnLoad: !1,
          targetClass: g,
          prototypeNames: M
        }
      );
    }
    return m;
  }
  o(i, "u"), J(i, "getInjectableOptionOrCreate");
  function a(g) {
    const m = ti();
    return (M) => {
      m(M), Object.assign(i(M), g);
    };
  }
  o(a, "g"), J(a, "Injectable"), e.Injectable = a;
  function f(g) {
    return ei(g);
  }
  o(f, "d"), J(f, "Inject"), e.Inject = f;
  function d(g = "") {
    const m = r(g), M = new Map(t);
    for (let [E, x] of t.entries())
      x.moduleName && g !== x.moduleName ? M.delete(E) : x.prototypeNames.slice(1).forEach((L) => M.delete(L));
    const N = [];
    for (let E of M.values()) {
      E.createOnLoad && N.push(E);
      for (let x = 0; x < E.prototypeNames.length; x++) {
        const L = E.prototypeNames[x];
        E.singleton ? x === 0 ? m.bind(L).to(E.targetClass).inSingletonScope() : m.bind(L).toDynamicValue(() => m.get(E.targetClass.name)) : m.bind(L).to(E.targetClass);
      }
    }
    for (let E of N)
      m.get(E.targetClass.name);
  }
  o(d, "b"), J(d, "load"), e.load = d;
  function v(g = "") {
    const m = n.get(g);
    m && (m.unbindAll(), n.delete(g));
  }
  o(v, "h"), J(v, "unload"), e.unload = v;
  function u(g, m) {
    const M = r(m).get(g.name);
    if (!M)
      throw new Error(`Unable to find instance of class ${g.name}`);
    return M;
  }
  o(u, "j"), J(u, "getInstance"), e.getInstance = u;
  async function h(g) {
    const m = g(), M = [];
    for (let N in m) {
      const E = m[N];
      if (typeof E == "function") {
        const x = E();
        x instanceof Promise && M.push(x);
      } else
        E instanceof Promise && M.push(E);
    }
    await Promise.all(M);
  }
  o(h, "w"), J(h, "importAll"), e.importAll = h;
})(st || (st = {}));
const it = class it {
  constructor() {
    const t = se();
    if (!t)
      throw new Error("Cannot directly create VueComponent instance");
    this.vueInstance = t, this.context = t.appContext;
  }
  get props() {
    return this.vueInstance.props;
  }
  render() {
  }
};
o(it, "VueComponent"), it.defineProps = [], it.defineEmits = [];
let gt = it;
function di(e) {
  return ce(
    () => {
      const t = st.getInstance(e);
      return si(e, t), t.render.bind(t);
    },
    {
      name: e.name,
      props: e.defineProps,
      emits: e.defineEmits
    }
  );
}
o(di, "toNative");
var ii = Object.defineProperty, ai = Object.getOwnPropertyDescriptor, oi = /* @__PURE__ */ o((e, t, n, r) => {
  for (var i = r > 1 ? void 0 : r ? ai(t, n) : t, a = e.length - 1, f; a >= 0; a--)
    (f = e[a]) && (i = (r ? f(t, n, i) : f(i)) || i);
  return r && i && ii(t, n, i), i;
}, "__decorateClass");
const xt = class xt {
  constructor() {
    this.mutts = [], this.links = [], this.hooks = [], this.watchers = [], this.propsWatchers = [], this.computers = [];
  }
  handleWatchers(t) {
    for (let n of this.watchers) {
      let r = t[n.methodName];
      if (typeof r != "function")
        throw new Error("Decorator Watcher can only be used on methods");
      if (r = r.bind(t), !n.source)
        fe(r, n.option);
      else {
        n.source instanceof Array || (n.source = [n.source]);
        const i = n.source.map((a) => typeof a == "string" ? () => t[a] : () => a(t));
        zt(i, r, n.option);
      }
    }
  }
  handlePropsWatchers(t) {
    for (let n of this.propsWatchers) {
      let r = t[n.methodName];
      if (typeof r != "function")
        throw new Error("Decorator PropsWatcher can only be used on methods");
      r = r.bind(t), zt(t.props, r, n.option);
    }
  }
  handleHook(t) {
    for (let n of this.hooks) {
      let r = t[n.methodName];
      if (typeof r != "function")
        throw new Error("Decorator Hook can only be used for methods");
      switch (r = r.bind(t), n.type) {
        case "onMounted":
          me(r);
          break;
        case "onUnmounted":
          be(r);
          break;
        case "onBeforeMount":
          we(r);
          break;
        case "onBeforeUnmount":
          _e(r);
          break;
        case "onUpdated":
          ge(r);
          break;
        case "onActivated":
          ye(r);
          break;
        case "onDeactivated":
          ve(r);
          break;
        case "onErrorCaptured":
          pe(r);
          break;
        case "onRenderTracked":
          he(r);
          break;
        case "onRenderTriggered":
          de(r);
          break;
        case "onServerPrefetch":
          le(r);
          break;
        default:
          throw new Error("Unknown Hook Type " + n.type);
      }
    }
  }
  handleMut(t) {
    for (let n of this.mutts) {
      const r = Ae(t[n]);
      Object.defineProperty(t, n, {
        configurable: !0,
        enumerable: !0,
        set(i) {
          r.value = i;
        },
        get() {
          return r.value;
        }
      });
    }
  }
  handleLink(t) {
    for (let n of this.links)
      Object.defineProperty(t, n, {
        configurable: !0,
        enumerable: !0,
        get() {
          var r;
          return (r = t.vueInstance.refs) == null ? void 0 : r[n];
        }
      });
  }
  handleComputer(t) {
    var r;
    if (!this.computers.length)
      return;
    const n = Object.getPrototypeOf(t);
    for (let i of this.computers) {
      const a = t[i];
      if (typeof a == "function") {
        const f = a.bind(t), d = tn(f);
        t[i] = () => d.value;
      } else {
        const f = (r = Object.getOwnPropertyDescriptor(
          n,
          i
        )) == null ? void 0 : r.get;
        if (!f)
          throw new Error(
            "Computer can only be used on getters or no parameter methods"
          );
        const d = tn(() => f.call(t));
        Object.defineProperty(t, i, {
          configurable: !0,
          get: () => d.value
        });
      }
    }
  }
};
o(xt, "Metadata");
let Ct = xt;
const Nt = /* @__PURE__ */ new Map();
function ui(e) {
  const t = Nt.get(e);
  if (!t)
    throw new Error("Unable to find corresponding Metadata instance");
  return t;
}
o(ui, "getMetadata");
function si(e, t) {
  const n = ui(e);
  n.handleMut(t), n.handleComputer(t), n.handleWatchers(t), t instanceof gt && (n.handleLink(t), n.handleHook(t), n.handlePropsWatchers(t));
}
o(si, "applyMetadata");
function K(e) {
  typeof e == "object" && (e = e.constructor);
  let t = Nt.get(e);
  return t || Nt.set(e, t = new Ct()), t;
}
o(K, "getOrCreateMetadata");
function hi() {
  const e = st.Injectable({
    singleton: !1,
    createOnLoad: !1
  });
  return (t) => {
    e(t), K(t);
  };
}
o(hi, "Component");
function pi(e) {
  const t = st.Injectable(
    Object.assign(
      {
        singleton: !1,
        createOnLoad: !1
      },
      e
    )
  );
  return (n) => {
    t(n), K(n);
  };
}
o(pi, "Service");
function ci() {
  return (e, t) => {
    K(e).mutts.push(t);
  };
}
o(ci, "Mut");
function vi() {
  return (e, t) => {
    K(e).links.push(t);
  };
}
o(vi, "Link");
function yi() {
  return (e, t) => {
    K(e).computers.push(t);
  };
}
o(yi, "Computed");
function gi(e) {
  return (t, n) => {
    K(t).hooks.push({ methodName: n, type: e });
  };
}
o(gi, "Hook");
function _i(e) {
  return (t, n) => {
    K(t).propsWatchers.push({ methodName: n, option: e });
  };
}
o(_i, "PropsWatcher");
function wi(e) {
  return (t, n) => {
    K(t).watchers.push({
      methodName: n,
      ...e
    });
  };
}
o(wi, "Watcher");
const jt = class jt extends gt {
  constructor() {
    super(...arguments), this.a = "";
  }
};
o(jt, "A");
let Dt = jt;
oi([
  ci()
], Dt.prototype, "a", 2);
export {
  hi as Component,
  yi as Computed,
  gi as Hook,
  vi as Link,
  ci as Mut,
  _i as PropsWatcher,
  pi as Service,
  gt as VueComponent,
  wi as Watcher,
  si as applyMetadata,
  ui as getMetadata,
  di as toNative
};
