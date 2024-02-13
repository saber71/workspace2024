import type { RouteRecordRaw } from "vue-router";

export async function autoRoutes(
  data: Record<string, any>,
  pathPrefix: string,
): Promise<RouteRecordRaw> {
  const root: RouteRecordRaw = {
    path: "/",
    children: [],
  };
  const reg = new RegExp("^" + pathPrefix);
  const fileReg = /\.(ts|tsx)$/;
  const homeReg = /\.home/;
  const routeItemsMap = new Map<string[], any>();
  const promises: Promise<any>[] = [];
  const routeItems = Object.entries(data)
    .map(([path, loader]) => {
      path = path.replace(reg, "");
      const arr = path.split("/").filter((item) => !!item);
      if (typeof loader === "function") loader = loader();
      if (loader instanceof Promise)
        promises.push(
          loader.then((val) => routeItemsMap.set(arr, val.default)),
        );
      else routeItemsMap.set(arr, loader.default);
      return arr;
    })
    .sort((a, b) => {
      if (a.length === b.length) return a.join().localeCompare(b.join());
      return a.length - b.length;
    });
  await Promise.all(promises);
  for (let routeItem of routeItems) {
    setRouteRecord(routeItem, 0, root, []);
  }
  return root;

  function setRouteRecord(
    routeItems: string[],
    index: number,
    parentRouteRecord: RouteRecordRaw,
    parentRouteItems: string[],
  ) {
    if (index >= routeItems.length) return;
    let routeItem = routeItems[index];
    const isFile = fileReg.test(routeItem);
    if (isFile) {
      const isHome = homeReg.test(routeItem);
      routeItem = routeItem.split(".")[0];
      if (isHome) {
        root.redirect = "/" + [...parentRouteItems, routeItem].join("/");
      }
    }
    let routeRecord: RouteRecordRaw | undefined =
      parentRouteRecord.children!.find((item) => item.path === routeItem);
    if (!routeRecord) {
      routeRecord = {
        path: routeItem,
        children: [],
      };
      if (isFile) {
        routeRecord.component = routeItemsMap.get(routeItems);
        const arr = routeItem
          .split(/[.\-]/)
          .map((str) => str[0].toUpperCase() + str.slice(1));
        routeRecord.name = arr.join("");
      }
      parentRouteRecord.children!.push(routeRecord);
    }
    setRouteRecord(routeItems, index + 1, routeRecord, [
      ...parentRouteItems,
      routeItem,
    ]);
  }
}