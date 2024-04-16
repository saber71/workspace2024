import { FsaNodeFs } from 'memfs/lib/fsa-to-node';
import path from 'path-browserify';

///<reference types="../types.d.ts"/>
async function createServerRuntimeBrowser() {
    const root = await navigator.storage.getDirectory();
    const fs = new FsaNodeFs(root);
    return {
        fs: fs.promises,
        path: {
            ...path,
            toNamespacedPath: (path)=>path
        }
    };
}

export { createServerRuntimeBrowser };
