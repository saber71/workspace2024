///<reference types="../types.d.ts"/>

import { FsaNodeFs } from "memfs/lib/fsa-to-node";

export async function createServerRuntimeBrowser(): Promise<ServerRuntimeAdapter> {
  const root = await navigator.storage.getDirectory();
  const fs = new FsaNodeFs(root as any);
  return {
    fs: fs as any,
  };
}
