import { deepClone, deepAssign } from 'common';
import { parseFilterCondition, sortData } from 'filter';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { v4 } from 'uuid';

///<reference types="../types.d.ts"/>
function createServerStoreFS(basePath = ".", saveOnExit = false) {
    basePath = path.resolve(basePath);
    const collections = initCollections();
    const needSaveCollectionNames = new Set();
    let prevTime = Date.now();
    if (saveOnExit) {
        process.on("exit", saveDataToFile);
        process.nextTick(()=>{
            const now = Date.now();
            if (now - prevTime >= 1000) {
                prevTime = now;
                saveCollectionChange();
            }
        });
    }
    return {
        init () {
            return Promise.resolve();
        },
        getById (collectionName, id) {
            return Promise.resolve(collections.get(collectionName)?.data[id]);
        },
        add (collectionName, ...items) {
            needSaveCollectionNames.add(collectionName);
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
            needSaveCollectionNames.add(collectionName);
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
            needSaveCollectionNames.add(collectionName);
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
    function saveCollectionChange() {
        if (needSaveCollectionNames.size) {
            saveCollections(Array.from(needSaveCollectionNames));
            needSaveCollectionNames.clear();
        }
    }
    function saveDataToFile() {
        if (!collections) return;
        saveCollections(Array.from(collections.keys()));
    }
    function saveCollections(collectionNames, sync = true) {
        if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
        for (let collectionName of collectionNames){
            const collection = collections.get(collectionName);
            if (collection) {
                const content = JSON.stringify(Object.values(collection.data));
                if (sync) fs.writeFileSync(collection.path, content);
                else fs.writeFile(collection.path, content, (err)=>{
                    if (err) throw err;
                });
            }
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
        if (sortOrders) sortData(result, sortOrders);
        return result.map((value)=>deepClone(value));
    }
}

export { createServerStoreFS };
