///<reference types="../types.d.ts"/>

import * as fs from "node:fs/promises";
import * as path from "node:path";

export function createServerRuntimeNode(): ServerRuntimeAdapter {
  return {
    fs,
    path,
  };
}
