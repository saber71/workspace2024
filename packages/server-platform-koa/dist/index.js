import Koa from 'koa';
import { koaBody } from 'koa-body';
import mount from 'koa-mount';
import Router from 'koa-router';
import send from 'koa-send';
import staticServe from 'koa-static';
import path from 'node:path';
import proxy from 'koa-proxies';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';

/// <reference types="../types" />
function createServerPlatformKoa() {
    const app = new Koa();
    const router = new Router();
    const proxies = [];
    let secretKey = "secretKey";
    let maxAge = "8h";
    return {
        name: "koa",
        create () {
            return Promise.resolve(app);
        },
        staticAssets (assetsPath, routePathPrefix) {
            app.use(mount(routePathPrefix, staticServe(assetsPath)));
        },
        bootstrap (option) {
            if (option.session?.secretKey) secretKey = option.session.secretKey;
            if (option.session?.maxAge) maxAge = option.session.maxAge;
            proxies.forEach((proxy)=>app.use(proxy));
            app.use(koaBody({
                multipart: true,
                formidable: {
                    keepExtensions: true,
                    multiples: true
                }
            })).use(router.routes()).use(router.allowedMethods()).listen(option.port, option.hostname);
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
                    const id = v4();
                    const req = createServerRequest(ctx, id, secretKey);
                    const res = createServerResponse(ctx, id, secretKey, req, maxAge);
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
function createServerRequest(ctx, id, secrectKey) {
    const token = ctx.get("Authorized");
    let session;
    try {
        session = jwt.verify(token, secrectKey);
    } catch (e) {
        session = {};
    }
    const headers = new Proxy({}, {
        get (_, p) {
            return ctx.request.get(p);
        }
    });
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
        method: ctx.method.toUpperCase(),
        URL: ctx.URL,
        body: ctx.request.body,
        files: ctx.request.files,
        session,
        get id () {
            return id;
        }
    };
}
function createServerResponse(ctx, id, secretKey, req, maxAge) {
    const headers = new Proxy({}, {
        get (_, p) {
            return ctx.res.getHeader(p);
        },
        set (_, p, newValue) {
            if (newValue === undefined || newValue === null) ctx.res.removeHeader(p);
            else ctx.res.setHeader(p, newValue);
            return true;
        }
    });
    return {
        original: ctx.response,
        headers,
        get id () {
            return id;
        },
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
            setupToken();
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
            setupToken();
            const fileName = path.basename(filePath);
            ctx.attachment(fileName);
            await send(ctx, fileName);
        },
        redirect (url) {
            setupToken();
            ctx.response.redirect(url);
        }
    };
    function setupToken() {
        if (req.session) {
            const token = jwt.sign(req.session, secretKey, {
                expiresIn: maxAge
            });
            ctx.res.setHeader("Authorized", token);
        } else {
            ctx.res.removeHeader("Authorized");
        }
    }
}

export { createServerPlatformKoa, createServerRequest, createServerResponse };
