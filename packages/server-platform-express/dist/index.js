var b = Object.defineProperty;
var a = (s, t) => b(s, "name", { value: t, configurable: !0 });
import c from "express";
import x from "express-session";
import R from "express-formidable";
import { URL as w } from "node:url";
import * as S from "node:querystring";
import * as j from "node:path";
function K() {
  const s = c(), t = c.Router(), o = [], e = [];
  return {
    name: "express",
    create() {
      return Promise.resolve(s);
    },
    staticAssets(r, n) {
      o.push([n, c.static(r)]);
    },
    useRoutes(r) {
      e.push(r);
    },
    bootstrap(r) {
      var n, u, f;
      for (let i of o)
        t.use(i[0], i[1]);
      for (let i of e)
        for (let m in i) {
          const p = i[m];
          t.use(m, async (d, h) => {
            const l = k(d), y = A(d, h);
            try {
              await p.handle(l, y);
            } catch (g) {
              p.catchError(g, l, y);
            }
            h.end();
          });
        }
      s.use(
        x({
          secret: ((n = r.session) == null ? void 0 : n.secretKey) ?? "express-secret-key",
          name: (u = r.session) == null ? void 0 : u.cookieKey,
          cookie: {
            secure: !0,
            maxAge: (f = r.session) == null ? void 0 : f.maxAge
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
    }
  };
}
a(K, "createServerPlatformExpress");
function k(s) {
  const t = new w(s.url), o = t.search.substring(1);
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
    query: S.parse(o),
    origin: s.originalUrl,
    body: e,
    session: s.session,
    files: s.files
  };
}
a(k, "createServerRequest");
function A(s, t) {
  const o = new Proxy(
    {},
    {
      set(e, r, n) {
        return t.setHeader(r, n), !0;
      },
      get(e, r) {
        return t.getHeader(r);
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
      e instanceof Buffer || (typeof e == "object" ? e = JSON.stringify(e) : typeof e != "string" && (e = String(e))), t.send(e);
    },
    async sendFile(e) {
      t.attachment(j.basename(e)), t.sendFile(e);
    },
    redirect(e) {
      t.redirect(e);
    }
  };
}
a(A, "createServerResponse");
export {
  K as createServerPlatformExpress,
  k as createServerRequest,
  A as createServerResponse
};
