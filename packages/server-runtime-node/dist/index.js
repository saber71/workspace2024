import * as fs from 'node:fs/promises';

///<reference types="../types.d.ts"/>
function createServerRuntimeNode() {
    return {
        fs
    };
}

export { createServerRuntimeNode };
