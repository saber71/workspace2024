///<reference types="../types.d.ts"/>

import * as fs from "node:fs/promises";

export function createServerRuntimeNode(): ServerRuntimeAdapter {
  return {
    fs,
  };
}
