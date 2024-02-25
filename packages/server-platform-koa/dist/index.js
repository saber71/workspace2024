var f = Object.defineProperty;
var i = (e, s) => f(e, "name", { value: s, configurable: !0 });
import p from "koa";
import h from "koa-body";
import d from "koa-mount";
import y from "koa-router";
import g from "koa-send";
import l from "koa-session";
import b from "koa-static";
import q from "node:path";
function E() {
  const e = new p(), s = new y();
  return {
    name: "koa",
    create() {
      return Promise.resolve(e);
    },
    staticAssets(r, o) {
      e.use(d(o, b(r)));
    },
    bootstrap(r) {
      var o, n, t;
      (o = r.session) != null && o.secretKey && (e.keys = [r.session.secretKey]), e.use(
        h({
          multipart: !0,
          formidable: { keepExtensions: !0, multiples: !0 }
        })
      ).use(
        l(
          {
            key: (n = r.session) == null ? void 0 : n.cookieKey,
            maxAge: (t = r.session) == null ? void 0 : t.maxAge
          },
          e
        )
      ).use(s.routes()).use(s.allowedMethods()).listen(r.port, r.hostname);
    },
    useRoutes(r) {
      for (let o in r) {
        const n = r[o];
        s.use(o, async (t) => {
          const a = c(t), u = k(t);
          try {
            await n.handle(a, u);
          } catch (m) {
            n.catchError(m, a, u);
          }
          t.res.end();
        });
      }
    }
  };
}
i(E, "createServerPlatformKoa");
function c(e) {
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
i(c, "createServerRequest");
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
      s instanceof Buffer || (typeof s == "object" ? s = JSON.stringify(s) : typeof s != "string" && (s = String(s))), e.response.body = s;
    },
    async sendFile(s) {
      const r = q.basename(s);
      e.attachment(r), await g(e, r);
    },
    redirect(s) {
      e.response.redirect(s);
    }
  };
}
i(k, "createServerResponse");
export {
  E as createServerPlatformKoa,
  c as createServerRequest,
  k as createServerResponse
};
