import { deepClone, deepAssign } from 'common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { v4 } from 'uuid';

///<reference types="../types.d.ts"/>
function createServerStoreFS(basePath = path.resolve("."), saveOnExit = true) {
    process.on("exit", saveDataToFile);
    const collections = initCollections();
    return {
        init () {
            return Promise.resolve();
        },
        add (collectionName, ...items) {
            const collection = getCollection(collectionName);
            const ids = [];
            for (let item of items){
                const id = item._id = item._id ?? v4();
                item = deepClone(item);
                if (id in collection.data) throw new Error("Failed to insert data: Duplicate id");
                collection.data[id] = item;
                ids.push(id);
            }
            return Promise.resolve(ids);
        },
        async search (collectionName, condition, sortOrders) {
            const collection = getCollection(collectionName);
            return query(collection, condition, sortOrders);
        },
        async update (collectionName, ...items) {
            const collection = getCollection(collectionName);
            for (let item of items){
                const id = item._id = item._id ?? v4();
                item = deepClone(item);
                if (!collection.data[id]) collection.data[id] = item;
                else deepAssign(collection.data[id], item);
            }
        },
        async paginationSearch (collectionName, condition, curPage, pageSize, sortOrders) {
            const collection = getCollection(collectionName);
            const result = query(collection, condition, sortOrders);
            return {
                total: result.length,
                curPage,
                pageSize,
                data: result.slice((curPage - 1) * pageSize, curPage * pageSize)
            };
        },
        async delete (collectionName, condition) {
            const collection = getCollection(collectionName);
            const result = query(collection, condition);
            const deleted = [];
            for (let item of result){
                deleted.push(item);
                delete collection.data[item._id];
            }
            return deleted;
        }
    };
    function initCollections() {
        const collections = new Map();
        if (fs.existsSync(basePath)) {
            const subNames = fs.readdirSync(basePath);
            for (let sub of subNames){
                const filePath = path.join(basePath, sub);
                if (fs.lstatSync(filePath).isDirectory()) continue;
                const content = fs.readFileSync(filePath, "utf8");
                const arr = JSON.parse(content);
                const data = {};
                for (let item of arr){
                    data[item._id] = item;
                }
                collections.set(sub, {
                    path: filePath,
                    data
                });
            }
        }
        return collections;
    }
    function saveDataToFile() {
        if (!collections || !saveOnExit) return;
        if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
        for (let collection of collections.values()){
            fs.writeFileSync(collection.path, JSON.stringify(Object.values(collection.data)));
        }
    }
    function getCollection(name) {
        let collection = collections.get(name);
        if (!collection) {
            collections.set(name, collection = {
                path: path.resolve(basePath, name),
                data: {}
            });
        }
        return collection;
    }
    function query(collection, condition, sortOrders) {
        const filterPredicates = parseFilterCondition(condition);
        const allData = Object.values(collection.data);
        const result = filterPredicates.length ? allData.filter((item)=>filterPredicates.every((fn)=>fn(item))) : allData.slice();
        if (sortOrders) {
            const sortPredicates = sortOrders.map((item)=>{
                if (item.order === "asc") return (a, b)=>a[item.field] - b[item.field];
                else return (a, b)=>b[item.field] - a[item.field];
            });
            result.sort((a, b)=>{
                for (let sortPredicate of sortPredicates){
                    const value = sortPredicate(a, b);
                    if (value) return value;
                }
                return 0;
            });
        }
        return result.map((value)=>deepClone(value));
    }
}
function matchFilterCondition(data, condition) {
    const filterPredicates = parseFilterCondition(condition);
    return filterPredicates.every((fn)=>fn(data));
}
function parseFilterCondition(condition) {
    if (!condition) return [];
    const filterPredicates = [];
    for(let keyOrPropName in condition){
        const value = condition[keyOrPropName];
        if (keyOrPropName === "$or" || keyOrPropName === "$nor") {
            const filterConditions = value;
            const conditions = filterConditions.map(parseFilterCondition);
            if (keyOrPropName === "$or") {
                filterPredicates.push((item)=>{
                    for (let fnArray of conditions){
                        if (fnArray.every((fn)=>fn(item))) return true;
                    }
                    return false;
                });
            } else {
                filterPredicates.push((item)=>{
                    for (let fnArray of conditions){
                        if (fnArray.every((fn)=>fn(item))) return false;
                    }
                    return true;
                });
            }
        } else {
            if (isCondition(value)) {
                parseCondition(keyOrPropName, value, filterPredicates);
            } else {
                filterPredicates.push((item)=>item[keyOrPropName] === value);
            }
        }
    }
    return filterPredicates;
}
function parseCondition(propName, condition, filterPredicates) {
    for(let conditionKey in condition){
        let conditionValue = condition[conditionKey];
        if (conditionValue === undefined) continue;
        if (conditionKey === "$less") filterPredicates.push((item)=>item[propName] < conditionValue);
        else if (conditionKey === "$greater") filterPredicates.push((item)=>item[propName] > conditionValue);
        else if (conditionKey === "$lessEqual") filterPredicates.push((item)=>item[propName] <= conditionValue);
        else if (conditionKey === "$greaterEqual") filterPredicates.push((item)=>item[propName] >= conditionValue);
        else if (conditionKey === "$not") filterPredicates.push((item)=>item[propName] !== conditionValue);
        else if (conditionKey === "$dateBefore") {
            if (conditionValue instanceof Date) conditionValue = conditionValue.getTime();
            filterPredicates.push((item)=>{
                let value = item[propName];
                if (value instanceof Date) value = value.getTime();
                else if (typeof value === "string") value = new Date(value).getTime();
                return value < conditionValue;
            });
        } else if (conditionKey === "$dateAfter") {
            if (conditionValue instanceof Date) conditionValue = conditionValue.getTime();
            filterPredicates.push((item)=>{
                let value = item[propName];
                if (value instanceof Date) value = value.getTime();
                else if (typeof value === "string") value = new Date(value).getTime();
                return value > conditionValue;
            });
        } else if (conditionKey === "$or") {
            const conditions = [];
            conditionValue.forEach((condition)=>parseCondition(propName, condition, conditions));
            filterPredicates.push((item)=>{
                for (let predicate of conditions){
                    if (predicate(item)) return true;
                }
                return false;
            });
        } else if (conditionKey === "$nor") {
            const conditions = [];
            conditionValue.forEach((condition)=>parseCondition(propName, condition, conditions));
            filterPredicates.push((item)=>{
                for (let predicate of conditions){
                    if (predicate(item)) return false;
                }
                return true;
            });
        } else if (conditionKey === "$in") {
            filterPredicates.push((item)=>conditionValue.includes(item[propName]));
        } else if (conditionKey === "$notIn") {
            filterPredicates.push((item)=>!conditionValue.includes(item[propName]));
        } else if (conditionKey === "$contains") {
            filterPredicates.push((item)=>{
                const value = item[propName];
                if (value instanceof Array) {
                    if (conditionValue instanceof Array) {
                        for (let cond of conditionValue){
                            if (!value.includes(cond)) return false;
                        }
                        return true;
                    } else return value.includes(conditionValue);
                } else if (typeof value === "string") {
                    if (conditionValue instanceof Array) {
                        for (let cond of conditionValue){
                            if (!value.includes(cond)) return false;
                        }
                        return true;
                    } else return value.includes(conditionValue);
                }
                return false;
            });
        } else if (conditionKey === "$notContains") {
            filterPredicates.push((item)=>{
                const value = item[propName];
                if (value instanceof Array) {
                    if (conditionValue instanceof Array) {
                        for (let cond of conditionValue){
                            if (value.includes(cond)) return false;
                        }
                        return true;
                    } else return !value.includes(conditionValue);
                } else if (typeof value === "string") {
                    if (conditionValue instanceof Array) {
                        for (let cond of conditionValue){
                            if (value.includes(cond)) return false;
                        }
                        return true;
                    } else return !value.includes(conditionValue);
                }
                return false;
            });
        } else if (conditionKey === "$match") {
            if (typeof conditionValue === "string") conditionValue = new RegExp(conditionValue);
            filterPredicates.push((item)=>conditionValue.test(item[propName]));
        }
    }
}
function isCondition(arg) {
    if (!arg || typeof arg !== "object") return false;
    const keys = [
        "$less",
        "$lessEqual",
        "greater",
        "$greaterEqual",
        "$not",
        "$dateBefore",
        "$dateAfter",
        "$or",
        "$nor",
        "$in",
        "$notIn",
        "$contains",
        "$notContains",
        "$match"
    ];
    for (let key of keys){
        if (key in arg) return true;
    }
    return false;
}

export { createServerStoreFS, matchFilterCondition };
