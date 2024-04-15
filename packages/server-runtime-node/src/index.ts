///<reference types="../types.d.ts"/>

import * as fs from "node:fs/promises";

export function createServerRuntimeNode(): ServerRuntimeAdapter {
  return {
    writeFile(path: string, content: any): Promise<void> {
      return fs.writeFile(path, content);
    },
    readdir(path: string): Promise<string[]> {
      return fs.readdir(path);
    },
    async readFileAsBlob(path: string): Promise<Blob> {
      const buffer = await fs.readFile(path);
      return new Blob([buffer.buffer]);
    },
    readFileAsString(path: string): Promise<string> {
      return fs.readFile(path, "utf-8");
    },
    mkdir(path: string): Promise<void> {
      return fs.mkdir(path);
    },
    rmdir(path: string): Promise<void> {
      return fs.rm(path, { recursive: true, force: true });
    },
    rmFile(path: string): Promise<void> {
      return fs.rm(path, { recursive: true, force: true });
    },
  };
}
