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
    if (typeof obj !== "object" || obj === undefined || obj === null) return obj;
    if (obj instanceof RegExp) return obj;
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
        const result = new (obj.constructor || Object)();
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

function If(cond) {
    const record = {
        if: {
            then: undefined,
            checkResult: checkCondition(cond)
        },
        elseIf: []
    };
    const object = {
        then (value) {
            if (record.if.then === undefined) record.if.then = value;
            else if (record.else) {
                if (!record.else.then) record.else.then = value;
            } else {
                const lastElseIf = record.elseIf.at(-1);
                if (lastElseIf) lastElseIf.then = value;
            }
            return this;
        },
        else (value) {
            if (!record.else) record.else = {};
            record.else.then = value;
            return object.done();
        },
        elseIf (cond) {
            record.elseIf.push({
                then: undefined,
                cond
            });
            return this;
        },
        done () {
            let result;
            if (record.if.checkResult) result = getValue(record.if.then);
            else {
                let gotIt = false;
                for (let item of record.elseIf){
                    if (checkCondition(item.cond)) {
                        result = getValue(item.then);
                        gotIt = true;
                        break;
                    }
                }
                if (!gotIt) result = getValue(record.else);
            }
            return result;
        }
    };
    return object;
}
function checkCondition(cond) {
    if (typeof cond === "function") return cond();
    return cond;
}
function getValue(val) {
    if (typeof val === "function") return val();
    return val;
}

const validChars = [];
for(let i = 65; i <= 90; i++)validChars.push(String.fromCharCode(i));
for(let i = 97; i <= 122; i++)validChars.push(String.fromCharCode(i));
for(let i = 48; i <= 58; i++)validChars.push(String.fromCharCode(i));
function randomString(len) {
    let result = "";
    for(let i = 0; i < len; i++){
        result += randomArrayItem(validChars);
    }
    return result;
}
function randomNumber(min, max) {
    return (max - min) * Math.random() + min;
}
function randomInt(min, max) {
    return Math.round(randomNumber(min, max));
}
function randomArrayItem(array) {
    return array[randomInt(0, array.length - 1)];
}

export { If, composeUrl, deepAssign, deepClone, isTypedArray, randomArrayItem, randomInt, randomNumber, randomString, remove, removeHeadTailChar };
