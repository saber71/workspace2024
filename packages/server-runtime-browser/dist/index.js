import { FsaNodeFs } from 'memfs/lib/fsa-to-node';

///<reference types="../types.d.ts"/>
async function createServerRuntimeBrowser() {
    const root = await navigator.storage.getDirectory();
    const fs = new FsaNodeFs(root);
    return {
        fs: fs
    };
}

export { createServerRuntimeBrowser };
