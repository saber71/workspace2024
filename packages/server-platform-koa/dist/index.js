var f = Object.defineProperty;
var i = (e, s) => f(e, "name", { value: s, configurable: !0 });
import h from "koa";
import p from "koa-body";
import y from "koa-mount";
import d from "koa-router";
import g from "koa-send";
import l from "koa-session";
import b from "koa-static";
import q from "node:path";
function N() {
  const e = new h(), s = new d();
  return {
    name: "koa",
    create() {
      return Promise.resolve(e);
    },
    staticAssets(r, o) {
      e.use(y(o, b(r)));
    },
    bootstrap(r) {
      var o, t, n;
      (o = r.session) != null && o.secretKey && (e.keys = [r.session.secretKey]), e.use(p({ multipart: !0, formidable: { keepExtensions: !0 } })).use(
        l(
          {
            key: (t = r.session) == null ? void 0 : t.cookieKey,
            maxAge: (n = r.session) == null ? void 0 : n.maxAge
          },
          e
        )
      ).use(s.routes()).use(s.allowedMethods()).listen(r.port, r.hostname);
    },
    useRoutes(r) {
      for (let o in r) {
        const t = r[o];
        s.use(o, async (n) => {
          const a = k(n), m = R(n);
          try {
            await t.handle(a, m);
          } catch (u) {
            t.catchError(u, a, m);
          }
        });
      }
    }
  };
}
i(N, "createServerPlatformKoa");
function k(e) {
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
    method: e.method,
    URL: e.URL,
    body: e.request.body,
    files: e.request.files,
    session: e.session
  };
}
i(k, "createServerRequest");
function R(e) {
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
      typeof s == "object" ? s = JSON.stringify(s) : typeof s != "string" && (s = String(s)), e.response.body = s;
    },
    async sendFile(s) {
      const r = q.basename(s);
      e.attachment(r), await g(e, r);
    }
  };
}
i(R, "createServerResponse");
export {
  N as createServerPlatformKoa,
  k as createServerRequest,
  R as createServerResponse
};
