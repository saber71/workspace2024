///<reference types="../types.d.ts"/>
function createServerRuntimeBrowser(store) {
    const collection = store.collection("server-runtime-browser");
    return {
        async rmFile (path) {
            await rmDirItem(path);
            path = normalizedPath(path);
            await collection.delete({
                _id: path
            });
        },
        async rmdir (path) {
            await rmDirItem(path);
            path = normalizedPath(path);
            const dir = await collection.delete({
                _id: path
            });
            for (let fsItem of dir){
                const children = fsItem.content;
                await collection.delete({
                    $or: children.map((child)=>({
                            _id: path + "/" + child
                        }))
                });
            }
        },
        async writeFile (path, content) {
            await addDirItem(path);
            path = normalizedPath(path);
            await collection.add({
                _id: path,
                path,
                content
            });
        },
        async readdir (path) {
            path = normalizedPath(path);
            const item = await collection.getById(path);
            return item?.content ?? [];
        },
        async readFileAsString (path) {
            path = normalizedPath(path);
            const item = await collection.getById(path);
            return item?.content ?? "";
        },
        async readFileAsBlob (path) {
            path = normalizedPath(path);
            const item = await collection.getById(path);
            return item?.content ?? new Blob();
        },
        async mkdir (path) {
            await addDirItem(path);
            path = normalizedPath(path);
            await collection.add({
                _id: path,
                path,
                content: []
            });
        }
    };
    function toPathItems(path) {
        const items = path.split(/[\/|\\]/);
        while(!items.at(-1) && items.length)items.pop();
        return items;
    }
    function normalizedPath(path) {
        return toPathItems(path).join("/");
    }
    function getParentPathAndChild(path) {
        const items = toPathItems(path);
        const child = items.at(-1);
        const parentPath = items.slice(0, items.length - 1).join("/");
        return [
            parentPath,
            child
        ];
    }
    async function rmDirItem(path) {
        const [parentPath, child] = getParentPathAndChild(path);
        const dir = await collection.getById(parentPath);
        if (dir) {
            const index = dir.content.indexOf(child);
            if (index >= 0) dir.content.splice(index, 1);
        }
    }
    async function addDirItem(path) {
        const [parentPath, child] = getParentPathAndChild(path);
        let dir = await collection.getById(parentPath);
        if (!dir) {
            dir = {
                _id: parentPath,
                path: parentPath,
                content: []
            };
        }
        if (!dir.content.includes(child)) dir.content.push(child);
        await collection.save(dir);
    }
}

export { createServerRuntimeBrowser };
