/// <reference types="../types" />
import Koa, { ParameterizedContext } from "koa";
import { koaBody } from "koa-body";
import mount from "koa-mount";
import Router from "koa-router";
import send from "koa-send";
import staticServe from "koa-static";
import path from "node:path";
import type { ServerRequest, ServerResponse } from "server";
import proxy from "koa-proxies";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";

export function createServerPlatformKoa(): ServerPlatformAdapter<Koa> {
  const app = new Koa();
  const router = new Router();
  const proxies: any[] = [];
  let secretKey = "secretKey";
  let maxAge: number | string = "8h";

  return {
    name: "koa",
    create(): Promise<Koa> {
      return Promise.resolve(app);
    },
    staticAssets(assetsPath: string, routePathPrefix: string) {
      app.use(mount(routePathPrefix, staticServe(assetsPath)));
    },
    bootstrap(option) {
      if (option.session?.secretKey) secretKey = option.session.secretKey;
      if (option.session?.maxAge) maxAge = option.session.maxAge;
      proxies.forEach((proxy) => app.use(proxy));
      app
        .use(
          koaBody({
            multipart: true,
            formidable: { keepExtensions: true, multiples: true },
          }),
        )
        .use(router.routes())
        .use(router.allowedMethods())
        .listen(option.port, option.hostname);
    },
    useRoutes(routes) {
      for (let url in routes) {
        const object = routes[url];
        for (let methodType of object.methodTypes) {
          if (methodType === "GET") router.get(url, getHandler(object));
          else if (methodType === "POST") router.post(url, getHandler(object));
          else if (methodType === "DELETE")
            router.delete(url, getHandler(object));
          else if (methodType === "PUT") router.put(url, getHandler(object));
          else throw new Error("unknown method type " + methodType);
        }
      }

      function getHandler(object: RouteHandlerObject) {
        return async (ctx: Koa.ParameterizedContext, next: () => void) => {
          const id = v4();
          const req = createServerRequest(ctx, id, secretKey);
          const res = createServerResponse(ctx, id, secretKey, req, maxAge);
          try {
            await object.handle(req, res);
          } catch (e) {
            await object.catchError(e as Error, req, res);
          }
          next();
        };
      }
    },
    proxy(option) {
      proxies.push(
        proxy(option.src, {
          changeOrigin: option.changeOrigin,
          target: option.target,
          rewrite: option.rewrites
            ? (path: string) => {
                for (let rewritesKey in option.rewrites) {
                  const reg = new RegExp(rewritesKey);
                  path = path.replace(reg, option.rewrites[rewritesKey]);
                }
                return path;
              }
            : undefined,
        }),
      );
    },
  } satisfies ServerPlatformAdapter<Koa>;
}

export function createServerRequest(
  ctx: Koa.ParameterizedContext,
  id: string,
  secrectKey: string,
): ServerRequest<Koa.Request> {
  const token = ctx.get("Authorized");
  let session: any;
  try {
    session = jwt.verify(token, secrectKey);
  } catch (e) {
    session = {};
  }
  const headers = new Proxy(
    {},
    {
      get(_: any, p: string): any {
        return ctx.request.get(p);
      },
    },
  );
  return {
    original: ctx.request,
    origin: ctx.origin,
    url: ctx.url,
    query: ctx.query,
    querystring: ctx.querystring,
    hostname: ctx.hostname,
    headers,
    host: ctx.host,
    href: ctx.href,
    path: ctx.path,
    search: ctx.search,
    method: ctx.method.toUpperCase() as MethodType,
    URL: ctx.URL,
    body: ctx.request.body,
    files: ctx.request.files,
    session,
    get id() {
      return id;
    },
  };
}

export function createServerResponse(
  ctx: ParameterizedContext,
  id: string,
  secretKey: string,
  req: ServerRequest,
  maxAge?: number | string,
): ServerResponse<Koa.Response> {
  const headers = new Proxy(
    {},
    {
      get(_: any, p: string): any {
        return ctx.res.getHeader(p);
      },
      set(_: any, p: string, newValue: any): boolean {
        if (newValue === undefined || newValue === null)
          ctx.res.removeHeader(p);
        else ctx.res.setHeader(p, newValue);
        return true;
      },
    },
  );
  return {
    original: ctx.response,
    headers,

    get id() {
      return id;
    },
    get session() {
      return ctx.session;
    },
    set session(value) {
      ctx.session = value;
    },

    set statusCode(value: number) {
      ctx.response.status = value;
    },
    get statusCode() {
      return ctx.response.status;
    },

    body(value: any) {
      setupToken();
      let contentType = "text/plain";
      if (!(value instanceof Buffer)) {
        if (typeof value === "object") {
          value = JSON.stringify(value);
          contentType = "application/json";
        } else if (typeof value !== "string") {
          value = String(value);
        }
      } else {
        contentType = "application/octet-stream";
      }
      ctx.response.type = contentType;
      ctx.response.body = value;
    },

    async sendFile(filePath: string) {
      setupToken();
      const fileName = path.basename(filePath);
      ctx.attachment(fileName);
      await send(ctx, fileName);
    },

    redirect(url) {
      setupToken();
      ctx.response.redirect(url);
    },
  };

  function setupToken() {
    if (req.session) {
      const token = jwt.sign(req.session, secretKey, { expiresIn: maxAge });
      ctx.res.setHeader("Authorized", token);
    } else {
      ctx.res.removeHeader("Authorized");
    }
  }
}
