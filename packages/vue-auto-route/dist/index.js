async function autoRoutes(data, pathPrefix) {
    const root = {
        path: "/",
        children: []
    };
    const reg = new RegExp("^" + pathPrefix);
    const homeReg = /\.home\./;
    const routeRecordMap = new Map();
    routeRecordMap.set("/", root);
    const promises = [];
    for (let [path, value] of Object.entries(data)){
        const arr = path.replace(reg, "").split("/");
        if (typeof value === "function") value = value();
        if (value instanceof Promise) promises.push(value.then((val)=>collect(arr, val)));
        else collect(arr, value);
    }
    await Promise.all(promises);
    return root;
    function collect(arr, component) {
        let prevRouteRecord;
        let i = 0;
        let accPath = "";
        for (let pathComponent of arr){
            const pathName = pathComponent.split(".");
            accPath += "/" + pathName[0];
            let routeRecord = routeRecordMap.get(accPath);
            if (!routeRecord) {
                routeRecord = {
                    path: pathName[0],
                    children: []
                };
                if (prevRouteRecord) {
                    prevRouteRecord.children.push(routeRecord);
                }
                routeRecordMap.set(accPath, routeRecord);
            }
            if (i === arr.length - 1) {
                if (prevRouteRecord) {
                    if (component.default.name) routeRecord.name = component.default.name;
                    routeRecord.component = component.default;
                    if (component.Meta) routeRecord.meta = Object.assign({}, component.Meta);
                    if (homeReg.test(pathComponent)) {
                        prevRouteRecord.redirect = arr.slice(0, arr.length - 1).concat([
                            pathName[0]
                        ]).join("/");
                    }
                }
            }
            prevRouteRecord = routeRecord;
            i++;
        }
    }
}

export { autoRoutes };
