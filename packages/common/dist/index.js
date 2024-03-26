function removeHeadTailChar(str, char) {
    while(str[0] === char)str = str.slice(1);
    while(str[str.length - 1] === char)str = str.slice(0, str.length - 1);
    return str;
}

/* 组装url */ function composeUrl(...items) {
    return "/" + items.map((str)=>removeHeadTailChar(str, "/")).filter((str)=>str.length > 0).join("/");
}

function isTypedArray(arr) {
    return arr instanceof Uint8Array || arr instanceof Uint8ClampedArray || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Float32Array || arr instanceof Float64Array;
}

function deepAssign(dst, src) {
    if (typeof dst !== "object" || !dst) return src;
    if (dst.constructor !== src.constructor) return src;
    if (dst instanceof Date) dst.setTime(src.getTime());
    else if (src instanceof Map) {
        const dstMap = dst;
        src.forEach((value, key)=>{
            dstMap.set(key, deepAssign(dstMap.get(key), value));
        });
    } else if (src instanceof Set) {
        const dstSet = dst;
        src.forEach((value)=>dstSet.add(value));
    } else if (isTypedArray(src)) {
        const dstTypedArray = dst;
        const len = Math.min(src.length, dstTypedArray.length);
        for(let i = 0; i < len; i++){
            dstTypedArray[i] = src[i];
        }
    } else {
        for(let key in src){
            const value = src[key];
            dst[key] = deepAssign(dst[key], value);
        }
    }
    return dst;
}

function deepClone(obj, options = {}) {
    if (typeof obj !== "object" || !obj) return obj;
    if (obj instanceof Set) {
        const result = new Set();
        obj.forEach((value)=>result.add(deepClone(value)));
        return result;
    } else if (obj instanceof Date) {
        return new Date(obj);
    } else if (obj instanceof Map) {
        const result = new Map();
        obj.forEach((value, key)=>{
            if (options.cloneMapKey) key = deepClone(key, options);
            result.set(key, deepClone(value));
        });
        return result;
    } else if (isTypedArray(obj)) {
        //@ts-ignore
        return new obj.constructor(obj);
    } else {
        //@ts-ignore
        const result = new obj.constructor();
        Object.assign(result, obj);
        for(let objKey in obj){
            const value = obj[objKey];
            result[objKey] = deepClone(value, options);
        }
        return result;
    }
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

export { composeUrl, deepAssign, deepClone, isTypedArray, remove, removeHeadTailChar };
