import Koa, { ParameterizedContext } from "koa";
import koaBody from "koa-body";
import mount from "koa-mount";
import Router from "koa-router";
import send from "koa-send";
import staticServe from "koa-static";
import path from "node:path";

export function createServerPlatformKoa(): ServerPlatformAdapter<Koa> {
  const app = new Koa();
  const router = new Router();

  return {
    name: "koa",
    create(): Promise<Koa> {
      return Promise.resolve(app);
    },
    staticAssets(assetsPath: string, routePathPrefix: string) {
      app.use(mount(routePathPrefix, staticServe(assetsPath)));
    },
    bootstrap(option) {
      app
        .use(koaBody({ multipart: true, formidable: { keepExtensions: true } }))
        .use(router.routes())
        .use(router.allowedMethods())
        .listen(option.port, option.hostname);
    },
    useRoutes(routes) {
      for (let route in routes) {
        const object = routes[route];
        router.use(route, async (ctx) => {
          const req = createServerRequest(ctx);
          const res = createServerResponse(ctx);
          try {
            await object.handle(req, res);
          } catch (e) {
            object.catchError(e as Error, req, res);
          }
        });
      }
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
    method: ctx.method,
    URL: ctx.URL,
    body: ctx.request.body,
    files: ctx.request.files,
  };
}

export function createServerResponse(
  ctx: ParameterizedContext,
): ServerResponse {
  return {
    original: ctx,
    headers: ctx.response.headers,

    set statusCode(value: number) {
      ctx.response.status = value;
    },
    get statusCode() {
      return ctx.response.status;
    },

    body(value: string | object | number | boolean) {
      if (typeof value === "object") value = JSON.stringify(value);
      else if (typeof value !== "string") value = String(value);
      ctx.response.body = value;
    },

    async sendFile(filePath: string) {
      const fileName = path.basename(filePath);
      ctx.attachment(fileName);
      await send(ctx, fileName);
    },
  };
}
