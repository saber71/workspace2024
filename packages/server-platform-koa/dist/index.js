var f = Object.defineProperty;
var t = (e, r) => f(e, "name", { value: r, configurable: !0 });
import h from "koa";
import p from "koa-body";
import d from "koa-mount";
import y from "koa-router";
import l from "koa-send";
import g from "koa-static";
import b from "node:path";
function L() {
  const e = new h(), r = new y();
  return {
    name: "koa",
    create() {
      return Promise.resolve(e);
    },
    staticAssets(s, o) {
      e.use(d(o, g(s)));
    },
    bootstrap(s) {
      e.use(p({ multipart: !0, formidable: { keepExtensions: !0 } })).use(r.routes()).use(r.allowedMethods()).listen(s.port, s.hostname);
    },
    useRoutes(s) {
      for (let o in s) {
        const n = s[o];
        r.use(o, async (a) => {
          const i = q(a), u = R(a);
          try {
            await n.handle(i, u);
          } catch (m) {
            n.catchError(m, i, u);
          }
        });
      }
    }
  };
}
t(L, "createServerPlatformKoa");
function q(e) {
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
    files: e.request.files
  };
}
t(q, "createServerRequest");
function R(e) {
  return {
    original: e,
    headers: e.response.headers,
    set statusCode(r) {
      e.response.status = r;
    },
    get statusCode() {
      return e.response.status;
    },
    body(r) {
      typeof r == "object" ? r = JSON.stringify(r) : typeof r != "string" && (r = String(r)), e.response.body = r;
    },
    async sendFile(r) {
      const s = b.basename(r);
      e.attachment(s), await l(e, s);
    }
  };
}
t(R, "createServerResponse");
export {
  L as createServerPlatformKoa,
  q as createServerRequest,
  R as createServerResponse
};
