import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import session from "express-session";
import formidableMiddleware from "express-formidable";
import * as fs from "fs";
import { createProxyMiddleware } from "http-proxy-middleware";
import { URL } from "node:url";
import * as qs from "node:querystring";
import * as path from "node:path";
import type { ServerRequest, ServerResponse } from "server";

export function createServerPlatformExpress(): ServerPlatformAdapter<Express> {
  const app = express();
  const router = express.Router();
  const staticAssets: Array<[string, any]> = [];
  const routes: Parameters<ServerPlatformAdapter["useRoutes"]>[0][] = [];
  const proxies: any[] = [];

  return {
    name: "express",
    create(): Promise<Express> {
      return Promise.resolve(app);
    },
    staticAssets(assetsPath: string, routePathPrefix: string) {
      staticAssets.push([routePathPrefix, express.static(assetsPath)]);
    },
    useRoutes(data) {
      routes.push(data);
    },
    bootstrap(option: ServerBootstrapOption) {
      for (let proxy of proxies) {
        app.use(proxy);
      }
      for (let item of staticAssets) {
        router.use(item[0], item[1]);
      }
      for (let route of routes) {
        for (let url in route) {
          const object = route[url];
          for (let methodType of object.methodTypes) {
            if (methodType === "GET") router.get(url, getRouteHandler(object));
            else if (methodType === "POST")
              router.post(url, getRouteHandler(object));
            else if (methodType === "DELETE")
              router.delete(url, getRouteHandler(object));
            else if (methodType === "PUT")
              router.put(url, getRouteHandler(object));
            else throw new Error("unknown method type " + methodType);
          }
        }
      }
      app.use(
        session({
          secret: option.session?.secretKey ?? "express-secret-key",
          name: option.session?.cookieKey,
          resave: true,
          saveUninitialized: false,
          cookie: {
            secure: true,
            maxAge: option.session?.maxAge,
          },
        }),
      );
      app.use(
        formidableMiddleware({
          multiples: true,
          keepExtensions: true,
        }),
      );
      app.use(router).listen(option.port ?? 4000, option.hostname || "");
    },
    proxy(option) {
      proxies.push(
        createProxyMiddleware(option.src, {
          target: option.target,
          changeOrigin: option.changeOrigin,
          pathRewrite: option.rewrites,
        }),
      );
    },
  } satisfies ServerPlatformAdapter<Express>;
}

function getRouteHandler(object: RouteHandlerObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = createServerRequest(req);
    const response = createServerResponse(req, res);
    try {
      await object.handle(request, response);
    } catch (e) {
      object.catchError(e as Error, request, response);
    }
    next();
  };
}

export function createServerRequest(req: Request): ServerRequest<Request> {
  const url = new URL("http://" + req.headers.host + req.url);
  const querystring = url.search.substring(1);

  let body: any = req.body;
  if (req.fields) {
    if (typeof body === "object" && body)
      body = Object.assign({}, body, req.fields);
    else body = req.fields;
  }

  if (req.files) {
    for (let field in req.files) {
      const files = req.files[field];
      if (files instanceof Array) files.forEach(handleFile);
      else handleFile(files);
    }
  }

  /* 确保文件对象的字段与ServerFile类型保持一致 */
  function handleFile(file: any) {
    file.filepath = file.path;
    file.originalFilename = file.name;
    file.newFilename = path.basename(file.path);
  }

  return {
    original: req,
    headers: req.headers,
    hostname: req.hostname,
    href: url.href,
    url: req.url,
    URL: url,
    host: url.host,
    search: url.search,
    querystring,
    path: req.path,
    method: req.method.toUpperCase() as MethodType,
    query: qs.parse(querystring),
    origin: req.originalUrl,
    body,
    session: req.session,
    files: req.files,
  };
}

export function createServerResponse(
  req: Request,
  res: Response,
): ServerResponse<Response> {
  const headers = new Proxy(
    {},
    {
      set(_, p: string, newValue: any): boolean {
        res.setHeader(p, newValue);
        return true;
      },
      get(_, p: string): any {
        return res.getHeader(p);
      },
    },
  );

  return {
    set statusCode(value) {
      res.status(value);
    },
    get statusCode() {
      return res.statusCode;
    },

    set session(value) {
      req.session = value;
    },
    get session() {
      return req.session;
    },

    original: res,
    headers,

    body(value?: any) {
      if (!(value instanceof Buffer)) {
        if (typeof value === "object") {
          res.json(value);
        } else if (typeof value !== "string") {
          value = String(value);
          res.send(value);
        } else {
          res.send(value);
        }
      } else {
        res.send(value);
      }
    },

    async sendFile(filePath: string) {
      res.attachment(path.basename(filePath));
      res.sendFile(filePath);
    },

    redirect(url) {
      res.redirect(url);
    },
  };
}
