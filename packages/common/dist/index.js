function removeHeadTailChar(str, char) {
    while(str[0] === char)str = str.slice(1);
    while(str[str.length - 1] === char)str = str.slice(0, str.length - 1);
    return str;
}

/* 组装url */ function composeUrl(...items) {
    return "/" + items.map((str)=>removeHeadTailChar(str, "/")).filter((str)=>str.length > 0).join("/");
}

/* 从集合中删除指定的内容 */ function remove(collection, item, isPredicate) {
    let needRemove;
    if (isPredicate === undefined && typeof item === "function") isPredicate = true;
    if (isPredicate && item) needRemove = Array.from(collection).filter(item);
    else needRemove = [
        item
    ];
    if (collection instanceof Array) {
        for (let item of needRemove){
            const index = collection.indexOf(item);
            if (index >= 0) collection.splice(index, 1);
        }
    } else {
        for (let item of needRemove){
            collection.delete(item);
        }
    }
    return collection;
}

export { composeUrl, remove, removeHeadTailChar };
