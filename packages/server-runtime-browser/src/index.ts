///<reference types="../types.d.ts"/>

import type { ServerStore } from "server-store";

export function createServerRuntimeBrowser(
  store: ServerStore,
): ServerRuntimeAdapter {
  const collection = store.collection<FsItem>("server-runtime-browser");
  return {
    async rmFile(path: string): Promise<void> {
      await rmDirItem(path);
      path = normalizedPath(path);
      await collection.delete({ _id: path });
    },
    async rmdir(path: string): Promise<void> {
      await rmDirItem(path);
      path = normalizedPath(path);
      const dir = await collection.delete({ _id: path });
      for (let fsItem of dir) {
        const children = fsItem.content as string[];
        await collection.delete({
          $or: children.map((child) => ({ _id: path + "/" + child })),
        });
      }
    },
    async writeFile(path: string, content: any): Promise<void> {
      await addDirItem(path);
      path = normalizedPath(path);
      await collection.add({
        _id: path,
        path,
        content,
      });
    },
    async readdir(path: string): Promise<string[]> {
      path = normalizedPath(path);
      const item = await collection.getById(path);
      return item?.content ?? [];
    },
    async readFileAsString(path: string): Promise<string> {
      path = normalizedPath(path);
      const item = await collection.getById(path);
      return item?.content ?? "";
    },
    async readFileAsBlob(path: string): Promise<Blob> {
      path = normalizedPath(path);
      const item = await collection.getById(path);
      return item?.content ?? new Blob();
    },
    async mkdir(path: string): Promise<void> {
      await addDirItem(path);
      path = normalizedPath(path);
      await collection.add({
        _id: path,
        path,
        content: [],
      });
    },
  };

  function toPathItems(path: string): string[] {
    const items = path.split(/[\/|\\]/);
    while (!items.at(-1) && items.length) items.pop();
    return items;
  }

  function normalizedPath(path: string) {
    return toPathItems(path).join("/");
  }

  function getParentPathAndChild(path: string): [string, string] {
    const items = toPathItems(path);
    const child = items.at(-1)!;
    const parentPath = items.slice(0, items.length - 1).join("/");
    return [parentPath, child];
  }

  async function rmDirItem(path: string) {
    const [parentPath, child] = getParentPathAndChild(path);
    const dir = await collection.getById(parentPath);
    if (dir) {
      const index = dir.content.indexOf(child);
      if (index >= 0) dir.content.splice(index, 1);
    }
  }

  async function addDirItem(path: string): Promise<void> {
    const [parentPath, child] = getParentPathAndChild(path);
    let dir = await collection.getById(parentPath);
    if (!dir) {
      dir = {
        _id: parentPath,
        path: parentPath,
        content: [],
      };
    }
    if (!(dir.content as string[]).includes(child)) dir.content.push(child);
    await collection.save(dir);
  }
}
