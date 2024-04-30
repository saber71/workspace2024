import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { ServerRuntimeAdapter } from "server";

export function createServerRuntimeNode(): ServerRuntimeAdapter {
  return {
    fs,
    path,
  };
}
