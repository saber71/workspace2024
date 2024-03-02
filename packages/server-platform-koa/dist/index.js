import Koa from 'koa';
import { koaBody } from 'koa-body';
import mount from 'koa-mount';
import Router from 'koa-router';
import send from 'koa-send';
import session from 'koa-session';
import staticServe from 'koa-static';
import path from 'node:path';
import proxy from 'koa-proxies';

/// <reference types="../types" />
function createServerPlatformKoa() {
    const app = new Koa();
    const router = new Router();
    const proxies = [];
    return {
        name: "koa",
        create () {
            return Promise.resolve(app);
        },
        staticAssets (assetsPath, routePathPrefix) {
            app.use(mount(routePathPrefix, staticServe(assetsPath)));
        },
        bootstrap (option) {
            if (option.session?.secretKey) app.keys = [
                option.session.secretKey
            ];
            proxies.forEach((proxy)=>app.use(proxy));
            app.use(koaBody({
                multipart: true,
                formidable: {
                    keepExtensions: true,
                    multiples: true
                }
            })).use(session({
                key: option.session?.cookieKey ?? "Secret key",
                maxAge: option.session?.maxAge
            }, app)).use(router.routes()).use(router.allowedMethods()).listen(option.port, option.hostname);
        },
        useRoutes (routes) {
            for(let url in routes){
                const object = routes[url];
                for (let methodType of object.methodTypes){
                    if (methodType === "GET") router.get(url, getHandler(object));
                    else if (methodType === "POST") router.post(url, getHandler(object));
                    else if (methodType === "DELETE") router.delete(url, getHandler(object));
                    else if (methodType === "PUT") router.put(url, getHandler(object));
                    else throw new Error("unknown method type " + methodType);
                }
            }
            function getHandler(object) {
                return async (ctx, next)=>{
                    const req = createServerRequest(ctx);
                    const res = createServerResponse(ctx);
                    try {
                        await object.handle(req, res);
                    } catch (e) {
                        await object.catchError(e, req, res);
                    }
                    next();
                };
            }
        },
        proxy (option) {
            proxies.push(proxy(option.src, {
                changeOrigin: option.changeOrigin,
                target: option.target,
                rewrite: option.rewrites ? (path)=>{
                    for(let rewritesKey in option.rewrites){
                        const reg = new RegExp(rewritesKey);
                        path = path.replace(reg, option.rewrites[rewritesKey]);
                    }
                    return path;
                } : undefined
            }));
        }
    };
}
function createServerRequest(ctx) {
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
        method: ctx.method.toUpperCase(),
        URL: ctx.URL,
        body: ctx.request.body,
        files: ctx.request.files,
        session: ctx.session
    };
}
function createServerResponse(ctx) {
    return {
        original: ctx.response,
        headers: ctx.response.headers,
        get session () {
            return ctx.session;
        },
        set session (value){
            ctx.session = value;
        },
        set statusCode (value){
            ctx.response.status = value;
        },
        get statusCode () {
            return ctx.response.status;
        },
        body (value1) {
            let contentType = "text/plain";
            if (!(value1 instanceof Buffer)) {
                if (typeof value1 === "object") {
                    value1 = JSON.stringify(value1);
                    contentType = "application/json";
                } else if (typeof value1 !== "string") {
                    value1 = String(value1);
                }
            } else {
                contentType = "application/octet-stream";
            }
            ctx.response.type = contentType;
            ctx.response.body = value1;
        },
        async sendFile (filePath) {
            const fileName = path.basename(filePath);
            ctx.attachment(fileName);
            await send(ctx, fileName);
        },
        redirect (url) {
            ctx.response.redirect(url);
        }
    };
}

export { createServerPlatformKoa, createServerRequest, createServerResponse };
