var b = Object.defineProperty;
var c = (s, t) => b(s, "name", { value: t, configurable: !0 });
import u from "express";
import w from "express-session";
import R from "express-formidable";
import { createProxyMiddleware as j } from "http-proxy-middleware";
import { URL as k } from "node:url";
import * as A from "node:querystring";
import * as C from "node:path";
function L() {
  const s = u(), t = u.Router(), o = [], e = [], i = [];
  return {
    name: "express",
    create() {
      return Promise.resolve(s);
    },
    staticAssets(r, a) {
      o.push([a, u.static(r)]);
    },
    useRoutes(r) {
      e.push(r);
    },
    bootstrap(r) {
      var a, f, m;
      for (let n of i)
        s.use(n);
      for (let n of o)
        t.use(n[0], n[1]);
      for (let n of e)
        for (let p in n) {
          const d = n[p];
          t.use(p, async (h, l) => {
            const g = E(h), y = S(h, l);
            try {
              await d.handle(g, y);
            } catch (x) {
              d.catchError(x, g, y);
            }
            l.end();
          });
        }
      s.use(
        w({
          secret: ((a = r.session) == null ? void 0 : a.secretKey) ?? "express-secret-key",
          name: (f = r.session) == null ? void 0 : f.cookieKey,
          cookie: {
            secure: !0,
            maxAge: (m = r.session) == null ? void 0 : m.maxAge
          }
        })
      ), s.use(
        R({
          multiples: !0,
          keepExtensions: !0,
          //@ts-ignore
          allowEmptyFiles: !0
        })
      ), s.use(t).listen(r.port ?? 4e3, r.hostname || "");
    },
    proxy(r) {
      i.push(
        j(r.src, {
          target: r.target,
          changeOrigin: r.changeOrigin,
          pathRewrite: r.rewrites
        })
      );
    }
  };
}
c(L, "createServerPlatformExpress");
function E(s) {
  const t = new k(s.url), o = t.search.substring(1);
  let e = s.body;
  return s.fields && (typeof e == "object" && e ? e = Object.assign({}, e, s.fields) : e = s.fields), {
    original: s,
    headers: s.headers,
    hostname: s.hostname,
    href: t.href,
    url: s.url,
    URL: t,
    host: s.host,
    search: t.search,
    querystring: o,
    path: s.path,
    method: s.method.toUpperCase(),
    query: A.parse(o),
    origin: s.originalUrl,
    body: e,
    session: s.session,
    files: s.files
  };
}
c(E, "createServerRequest");
function S(s, t) {
  const o = new Proxy(
    {},
    {
      set(e, i, r) {
        return t.setHeader(i, r), !0;
      },
      get(e, i) {
        return t.getHeader(i);
      }
    }
  );
  return {
    set statusCode(e) {
      t.status(e);
    },
    get statusCode() {
      return t.statusCode;
    },
    set session(e) {
      s.session = e;
    },
    get session() {
      return s.session;
    },
    original: t,
    headers: o,
    body(e) {
      e instanceof Buffer ? t.send(e) : typeof e == "object" ? t.json(e) : (typeof e != "string" && (e = String(e)), t.send(e));
    },
    async sendFile(e) {
      t.attachment(C.basename(e)), t.sendFile(e);
    },
    redirect(e) {
      t.redirect(e);
    }
  };
}
c(S, "createServerResponse");
export {
  L as createServerPlatformExpress,
  E as createServerRequest,
  S as createServerResponse
};
