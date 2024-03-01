import express from 'express';
import session from 'express-session';
import formidableMiddleware from 'express-formidable';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { URL } from 'node:url';
import * as qs from 'node:querystring';
import * as path from 'node:path';

function createServerPlatformExpress() {
    const app = express();
    const router = express.Router();
    const staticAssets = [];
    const routes = [];
    const proxies = [];
    return {
        name: "express",
        create () {
            return Promise.resolve(app);
        },
        staticAssets (assetsPath, routePathPrefix) {
            staticAssets.push([
                routePathPrefix,
                express.static(assetsPath)
            ]);
        },
        useRoutes (data) {
            routes.push(data);
        },
        bootstrap (option) {
            for (let proxy of proxies){
                app.use(proxy);
            }
            for (let item of staticAssets){
                router.use(item[0], item[1]);
            }
            for (let route of routes){
                for(let url in route){
                    const object = route[url];
                    for (let methodType of object.methodTypes){
                        if (methodType === "GET") router.get(url, getRouteHandler(object));
                        else if (methodType === "POST") router.post(url, getRouteHandler(object));
                        else if (methodType === "DELETE") router.delete(url, getRouteHandler(object));
                        else if (methodType === "PUT") router.put(url, getRouteHandler(object));
                        else throw new Error("unknown method type " + methodType);
                    }
                }
            }
            app.use(session({
                secret: option.session?.secretKey ?? "express-secret-key",
                name: option.session?.cookieKey,
                resave: true,
                saveUninitialized: false,
                cookie: {
                    secure: true,
                    maxAge: option.session?.maxAge
                }
            }));
            app.use(formidableMiddleware({
                multiples: true,
                keepExtensions: true,
                //@ts-ignore
                allowEmptyFiles: true
            }));
            app.use(router).listen(option.port ?? 4000, option.hostname || "");
        },
        proxy (option) {
            proxies.push(createProxyMiddleware(option.src, {
                target: option.target,
                changeOrigin: option.changeOrigin,
                pathRewrite: option.rewrites
            }));
        }
    };
}
function getRouteHandler(object) {
    return async (req, res, next)=>{
        const request = createServerRequest(req);
        const response = createServerResponse(req, res);
        try {
            await object.handle(request, response);
        } catch (e) {
            object.catchError(e, request, response);
        }
        next();
    };
}
function createServerRequest(req) {
    const url = new URL("http://" + req.headers.host + req.url);
    const querystring = url.search.substring(1);
    let body = req.body;
    if (req.fields) {
        if (typeof body === "object" && body) body = Object.assign({}, body, req.fields);
        else body = req.fields;
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
        method: req.method.toUpperCase(),
        query: qs.parse(querystring),
        origin: req.originalUrl,
        body,
        session: req.session,
        files: req.files
    };
}
function createServerResponse(req, res) {
    const headers = new Proxy({}, {
        set (_, p, newValue) {
            res.setHeader(p, newValue);
            return true;
        },
        get (_, p) {
            return res.getHeader(p);
        }
    });
    return {
        set statusCode (value){
            res.status(value);
        },
        get statusCode () {
            return res.statusCode;
        },
        set session (value){
            req.session = value;
        },
        get session () {
            return req.session;
        },
        original: res,
        headers,
        body (value1) {
            if (!(value1 instanceof Buffer)) {
                if (typeof value1 === "object") {
                    res.json(value1);
                } else if (typeof value1 !== "string") {
                    value1 = String(value1);
                    res.send(value1);
                } else {
                    res.send(value1);
                }
            } else {
                res.send(value1);
            }
        },
        async sendFile (filePath) {
            res.attachment(path.basename(filePath));
            res.sendFile(filePath);
        },
        redirect (url) {
            res.redirect(url);
        }
    };
}

export { createServerPlatformExpress, createServerRequest, createServerResponse };
