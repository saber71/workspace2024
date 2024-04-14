import { parseFilterCondition, sortData } from 'filter';
import { v4 } from 'uuid';

///<reference types="../types.d.ts"/>
function createServerStoreIndexdb() {
    const dbMap = new Map();
    return {
        async add (collectionName, ...items) {
            const ids = [];
            const store = await getObjectStore(collectionName);
            const promises = [];
            for (let item of items){
                if (!item._id) item._id = v4();
                ids.push(item._id);
                promises.push(wrapRequest(store.add(item)));
            }
            await Promise.all(promises);
            return ids;
        },
        async delete (collectionName, condition) {
            const store = await getObjectStore(collectionName);
            const array = await query(store, condition);
            await Promise.all(array.map((item)=>wrapRequest(store.delete(item._id))));
            return Promise.resolve(array);
        },
        async getById (collectionName, id) {
            const store = await getObjectStore(collectionName, "readonly");
            const request = store.get(id);
            return await wrapRequest(request);
        },
        init () {
            return Promise.resolve();
        },
        async paginationSearch (collectionName, condition, curPage, pageSize, sortOrders) {
            const array = await this.search(collectionName, condition, sortOrders);
            return {
                data: array.slice((curPage - 1) * pageSize, curPage * pageSize),
                curPage,
                pageSize,
                total: array.length
            };
        },
        async search (collectionName, condition, sortOrders) {
            const store = await getObjectStore(collectionName);
            return await query(store, condition, sortOrders);
        },
        async update (collectionName, ...items) {
            const store = await getObjectStore(collectionName);
            await Promise.all(items.map((item)=>wrapRequest(store.put(item))));
        }
    };
    async function query(store, condition, sortOrders) {
        const filters = condition ? [
            ()=>true
        ] : parseFilterCondition(condition);
        const array = await new Promise((resolve, reject)=>{
            const cursor = store.openCursor();
            const array = [];
            cursor.onsuccess = ()=>{
                if (cursor.result) {
                    if (filters.every((fn)=>fn(cursor.result))) array.push(cursor.result);
                } else resolve(array);
            };
        });
        if (sortOrders) sortData(array, sortOrders);
        return array;
    }
    function wrapRequest(req) {
        return new Promise((resolve, reject)=>{
            req.onsuccess = ()=>resolve(req.result);
            req.onerror = reject;
        });
    }
    async function getObjectStore(collectionName, mode = "readwrite") {
        const db = await getDatabase(collectionName);
        return db.transaction(collectionName, mode).objectStore("key-vaue");
    }
    async function getDatabase(collectionName) {
        let db = dbMap.get(collectionName);
        if (!db) {
            db = await new Promise((resolve, reject)=>{
                const request = window.indexedDB.open(collectionName, 1);
                request.onerror = reject;
                request.onsuccess = ()=>{
                    resolve(request.result);
                };
                request.onupgradeneeded = (e)=>{
                    const db = e.target.result;
                    db.createObjectStore("key-value", {
                        keyPath: "_id"
                    });
                };
            });
            dbMap.set(collectionName, db);
        }
        return db;
    }
}

export { createServerStoreIndexdb };
