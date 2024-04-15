import * as fs from 'node:fs/promises';

///<reference types="../types.d.ts"/>
function createServerRuntimeNode() {
    return {
        writeFile (path, content) {
            return fs.writeFile(path, content);
        },
        readdir (path) {
            return fs.readdir(path);
        },
        async readFileAsBlob (path) {
            const buffer = await fs.readFile(path);
            return new Blob([
                buffer.buffer
            ]);
        },
        readFileAsString (path) {
            return fs.readFile(path, "utf-8");
        },
        mkdir (path) {
            return fs.mkdir(path);
        },
        rmdir (path) {
            return fs.rm(path, {
                recursive: true,
                force: true
            });
        },
        rmFile (path) {
            return fs.rm(path, {
                recursive: true,
                force: true
            });
        }
    };
}

export { createServerRuntimeNode };
