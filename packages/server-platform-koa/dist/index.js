var p = Object.defineProperty;
var u = (e, s) => p(e, "name", { value: s, configurable: !0 });
import h from "koa";
import y from "koa-body";
import d from "koa-mount";
import g from "koa-router";
import l from "koa-send";
import c from "koa-session";
import w from "koa-static";
import b from "node:path";
import q from "koa-proxies";
function N() {
  const e = new h(), s = new g(), o = [];
  return {
    name: "koa",
    create() {
      return Promise.resolve(e);
    },
    staticAssets(r, t) {
      e.use(d(t, w(r)));
    },
    bootstrap(r) {
      var t, n, i;
      (t = r.session) != null && t.secretKey && (e.keys = [r.session.secretKey]), o.forEach((a) => e.use(a)), e.use(
        y({
          multipart: !0,
          formidable: { keepExtensions: !0, multiples: !0 }
        })
      ).use(
        c(
          {
            key: (n = r.session) == null ? void 0 : n.cookieKey,
            maxAge: (i = r.session) == null ? void 0 : i.maxAge
          },
          e
        )
      ).use(s.routes()).use(s.allowedMethods()).listen(r.port, r.hostname);
    },
    useRoutes(r) {
      for (let t in r) {
        const n = r[t];
        s.use(t, async (i) => {
          const a = R(i), m = k(i);
          try {
            await n.handle(a, m);
          } catch (f) {
            n.catchError(f, a, m);
          }
          i.res.end();
        });
      }
    },
    proxy(r) {
      o.push(
        q(r.src, {
          changeOrigin: r.changeOrigin,
          target: r.target,
          rewrite: r.rewrites ? (t) => {
            for (let n in r.rewrites) {
              const i = new RegExp(n);
              t = t.replace(i, r.rewrites[n]);
            }
            return t;
          } : void 0
        })
      );
    }
  };
}
u(N, "createServerPlatformKoa");
function R(e) {
  return {
    original: e.request,
    origin: e.origin,
    url: e.url,
    query: e.query,
    querystring: e.querystring,
    hostname: e.hostname,
    headers: e.headers,
    host: e.host,
    href: e.href,
    path: e.path,
    search: e.search,
    method: e.method.toUpperCase(),
    URL: e.URL,
    body: e.request.body,
    files: e.request.files,
    session: e.session
  };
}
u(R, "createServerRequest");
function k(e) {
  return {
    original: e.response,
    headers: e.response.headers,
    get session() {
      return e.session;
    },
    set session(s) {
      e.session = s;
    },
    set statusCode(s) {
      e.response.status = s;
    },
    get statusCode() {
      return e.response.status;
    },
    body(s) {
      let o = "text/plain;charset=utf-8";
      s instanceof Buffer ? o = "application/octet-stream" : typeof s == "object" ? (s = JSON.stringify(s), o = "application/json;charset=utf-8") : typeof s != "string" && (s = String(s)), e.response.headers["content-type"] = o, e.response.body = s;
    },
    async sendFile(s) {
      const o = b.basename(s);
      e.attachment(o), await l(e, o);
    },
    redirect(s) {
      e.response.redirect(s);
    }
  };
}
u(k, "createServerResponse");
export {
  N as createServerPlatformKoa,
  R as createServerRequest,
  k as createServerResponse
};
