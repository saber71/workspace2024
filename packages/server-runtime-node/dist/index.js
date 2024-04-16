import * as fs from 'node:fs/promises';
import * as path from 'node:path';

///<reference types="../types.d.ts"/>
function createServerRuntimeNode() {
    return {
        fs,
        path
    };
}

export { createServerRuntimeNode };
