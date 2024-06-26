import express from 'express';
import formidableMiddleware from 'express-formidable';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { URL } from 'node:url';
import * as qs from 'node:querystring';
import * as path from 'node:path';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';

function createServerPlatformExpress() {
    const app = express();
    const router = express.Router();
    const staticAssets = [];
    const routes = [];
    const proxies = [];
    let secretKey = "secretKey";
    let maxAge = "8h";
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
            if (option.session?.secretKey) secretKey = option.session.secretKey;
            if (option.session?.maxAge) maxAge = option.session.maxAge;
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
                        if (methodType === "GET") router.get(url, getRouteHandler(object, secretKey, maxAge));
                        else if (methodType === "POST") router.post(url, getRouteHandler(object, secretKey, maxAge));
                        else if (methodType === "DELETE") router.delete(url, getRouteHandler(object, secretKey, maxAge));
                        else if (methodType === "PUT") router.put(url, getRouteHandler(object, secretKey, maxAge));
                        else throw new Error("unknown method type " + methodType);
                    }
                }
            }
            app.use(formidableMiddleware({
                multiples: true,
                keepExtensions: true
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
function getRouteHandler(object, secretKey, maxAge) {
    return async (req, res, next)=>{
        const id = v4();
        const request = createServerRequest(req, id, secretKey);
        const response = createServerResponse(request, res, id, secretKey, maxAge);
        try {
            await object.handle(request, response);
        } catch (e) {
            await object.catchError(e, request, response);
        }
        next();
    };
}
function createServerRequest(req, id, secretKey) {
    const url = new URL(req.protocol + "://" + req.headers.host + req.url);
    const querystring = url.search.substring(1);
    let body = req.body;
    if (req.fields) {
        if (typeof body === "object" && body) body = Object.assign({}, body, req.fields);
        else body = req.fields;
    }
    if (req.files) {
        for(let field in req.files){
            const files = req.files[field];
            if (files instanceof Array) files.forEach(handleFile);
            else handleFile(files);
        }
    }
    /* 确保文件对象的字段与ServerFile类型保持一致 */ function handleFile(file) {
        file.filepath = file.path;
        file.originalFilename = file.name;
        file.newFilename = path.basename(file.path);
    }
    const token = req.get("Authorized") || "";
    let session;
    try {
        session = jwt.verify(token, secretKey);
    } catch (e) {
        session = {};
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
        session,
        files: req.files,
        get id () {
            return id;
        }
    };
}
function createServerResponse(req, res, id, secretKey, maxAge) {
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
        get id () {
            return id;
        },
        original: res,
        headers,
        body (value1) {
            setupToken();
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
            setupToken();
            res.attachment(path.basename(filePath));
            res.sendFile(filePath);
        },
        redirect (url) {
            setupToken();
            res.redirect(url);
        }
    };
    function setupToken() {
        if (req.session) {
            const payload = req.session;
            delete payload.iat;
            delete payload.exp;
            const token = jwt.sign(payload, secretKey, {
                expiresIn: maxAge
            });
            res.setHeader("Authorized", token);
        } else {
            res.removeHeader("Authorized");
        }
    }
}

export { createServerPlatformExpress, createServerRequest, createServerResponse };
