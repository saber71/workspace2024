import * as fs from 'node:fs/promises';
import * as path from 'node:path';

function createServerRuntimeNode() {
    return {
        fs,
        path
    };
}

export { createServerRuntimeNode };
