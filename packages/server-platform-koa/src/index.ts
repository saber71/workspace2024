/// <reference types="../types" />
import Koa, { ParameterizedContext } from "koa";
import { koaBody } from "koa-body";
import mount from "koa-mount";
import Router from "koa-router";
import send from "koa-send";
import session from "koa-session";
import staticServe from "koa-static";
import path from "node:path";
import type { ServerRequest, ServerResponse } from "server";
import proxy from "koa-proxies";

export function createServerPlatformKoa(): ServerPlatformAdapter<Koa> {
  const app = new Koa();
  const router = new Router();
  const proxies: any[] = [];

  return {
    name: "koa",
    create(): Promise<Koa> {
      return Promise.resolve(app);
    },
    staticAssets(assetsPath: string, routePathPrefix: string) {
      app.use(mount(routePathPrefix, staticServe(assetsPath)));
    },
    bootstrap(option) {
      if (option.session?.secretKey) app.keys = [option.session.secretKey];
      proxies.forEach((proxy) => app.use(proxy));
      app
        .use(
          koaBody({
            multipart: true,
            formidable: { keepExtensions: true, multiples: true },
          }),
        )
        .use(
          session(
            {
              key: option.session?.cookieKey ?? "Secret key",
              maxAge: option.session?.maxAge,
            },
            app,
          ),
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
          const req = createServerRequest(ctx);
          const res = createServerResponse(ctx);
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
): ServerRequest<Koa.Request> {
  return {
    original: ctx.request,
    origin: ctx.origin,
    url: ctx.url,
    query: ctx.query,
    querystring: ctx.querystring,
    hostname: ctx.hostname,
    headers: ctx.headers,
    host: ctx.host,
    href: ctx.href,
    path: ctx.path,
    search: ctx.search,
    method: ctx.method.toUpperCase() as MethodType,
    URL: ctx.URL,
    body: ctx.request.body,
    files: ctx.request.files,
    session: ctx.session,
  };
}

export function createServerResponse(
  ctx: ParameterizedContext,
): ServerResponse<Koa.Response> {
  return {
    original: ctx.response,
    headers: ctx.response.headers,

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
      const fileName = path.basename(filePath);
      ctx.attachment(fileName);
      await send(ctx, fileName);
    },

    redirect(url) {
      ctx.response.redirect(url);
    },
  };
}
