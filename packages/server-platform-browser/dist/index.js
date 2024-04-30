import axios from 'axios';
import { v4 } from 'uuid';

function createServerPlatformBrowser(runtime) {
    const app = {
        runtime,
        apply (url, option) {
            return new Promise((resolve)=>{
                function return404() {
                    return resolve({
                        data: null,
                        status: 404,
                        headers: option?.headers ?? {}
                    });
                }
                const urlOption = urlMap[url];
                if (!urlOption) return return404();
                const method = option?.method ?? "GET";
                const id = v4();
                const req = createServerRequest(id, app, {
                    url,
                    body: option?.body,
                    method,
                    headers: option?.headers ?? {},
                    files: option?.body
                });
                const res = createServerResponse(id, app, req, (data)=>{
                    resolve({
                        data,
                        status: res.statusCode,
                        headers: res.headers
                    });
                });
                if (urlOption.type === "route") {
                    const routeHandler = urlOption.routeHandler;
                    if (!routeHandler.methodTypes.has(method)) return return404();
                    try {
                        routeHandler.handle(req, res);
                    } catch (e) {
                        routeHandler.catchError(e, req, res);
                    }
                } else if (urlOption.type === "assets") {
                    if (!urlOption.filePath) return return404();
                    res.sendFile(urlOption.filePath);
                } else if (urlOption.type === "proxy") {
                    if (!urlOption.proxy) return return404();
                    if (urlOption.proxy.rewrites) {
                        for(let regStr in urlOption.proxy.rewrites){
                            const reg = new RegExp(regStr);
                            url = url.replace(reg, urlOption.proxy.rewrites[regStr]);
                        }
                    }
                    res.redirect(urlOption.proxy.target + url);
                }
            });
        }
    };
    const urlMap = {};
    return {
        name: "browser",
        create () {
            return Promise.resolve(app);
        },
        staticAssets (assetsPath, routePathPrefix) {
            urlMap[routePathPrefix] = {
                type: "assets",
                filePath: assetsPath
            };
        },
        useRoutes (routes) {
            for(let url in routes){
                const handler = routes[url];
                urlMap[url] = {
                    type: "route",
                    routeHandler: handler
                };
            }
        },
        bootstrap (option) {},
        proxy (option) {
            urlMap[option.src] = {
                type: "proxy",
                proxy: option
            };
        }
    };
}
function createServerRequest(id, original, req) {
    const url = new URL(location.origin + req.url);
    const query = {};
    for (let [key, value] of url.searchParams.entries()){
        query[key] = value;
    }
    const token = req.headers.Authorized;
    let session;
    try {
        session = token ? JSON.parse(token) : {};
    } catch (e) {
        session = {};
    }
    let files;
    if (req.files && req.files instanceof FormData) {
        files = {};
        function toServerFile(f) {
            const result = f;
            result.filepath = "";
            result.newFilename = f.name;
            result.originalFilename = f.name;
            return result;
        }
        req.files.forEach((f, field)=>{
            const file = f;
            if (!(file instanceof Array)) files[field] = toServerFile(file);
            else files[field] = file.map(toServerFile);
        });
    } else files = undefined;
    return {
        id,
        original,
        origin: location.origin,
        ...req,
        href: url.href,
        URL: url,
        host: url.host,
        hostname: url.hostname,
        search: url.search,
        path: url.pathname,
        querystring: url.search.substring(1),
        query,
        session,
        files
    };
}
function createServerResponse(id, original, req, callback) {
    const res = {
        id,
        original,
        session: req.session,
        headers: Object.assign({}, req.headers),
        statusCode: 200,
        body (value) {
            setupToken();
            callback(value);
        },
        async sendFile (filePath) {
            setupToken();
            const data = await original.runtime.fs.readFile(filePath);
            callback(data);
        },
        redirect (url) {
            axios.request({
                url,
                method: req.method,
                data: req.body,
                headers: req.headers,
                validateStatus: ()=>true
            }).then((res)=>{
                Object.assign(this.headers, res.headers);
                this.statusCode = res.status;
                setupToken();
                callback(res.data);
            });
        }
    };
    return res;
    function setupToken() {
        const field = "authorized";
        const token = res.session ? JSON.stringify(res.session) : null;
        if (token) res.headers[field] = token;
        else delete res.headers[field];
    }
}

export { createServerPlatformBrowser, createServerRequest, createServerResponse };
