#!/usr/bin/env node

import * as path from "node:path";
import * as fs from "node:fs";
import { composeUrl } from "common";

Promise.all([
  import("server"),
  import(path.resolve(".", "./dist/index.js")),
]).then(([{ Metadata }]) => {
  const metadataArray = Array.from(Metadata.getAllMetadata()).filter(
    (item) => item.userData.__server__classType === "controller",
  );
  const result = {};
  for (let metadata of metadataArray) {
    const data = {};
    result[metadata.clazz.name] = data;
    const userData = metadata.userData;
    const methods = userData.__server__controllerMethods;
    for (let methodName in methods) {
      const method = methods[methodName];
      const parameters = metadata.getMethodParameterTypes(methodName);
      data[methodName] = {
        type: method.type,
        url: composeUrl(
          userData.__server__controllerRoutePrefix,
          method.routePrefix,
          method.route,
        ),
        parameters: parameters.types.map(
          (_, index) =>
            userData[metadata.clazz.name + "." + methodName + "." + index] ?? 0,
        ),
      };
    }
  }
  fs.writeFileSync(
    path.resolve(".", "./dist/provider.json"),
    JSON.stringify(result),
  );
});
