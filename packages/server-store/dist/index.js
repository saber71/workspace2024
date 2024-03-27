import { Inject } from 'dependency-injection';

///<reference types="../types.d.ts"/>
class ServerStore {
    adapter;
    constructor(adapter){
        this.adapter = adapter;
    }
    static async create(adapter) {
        await adapter.init();
        return new ServerStore(adapter);
    }
    collection(name) {
        return new StoreCollection(this.adapter, name);
    }
}
class StoreCollection {
    adapter;
    name;
    constructor(adapter, name){
        this.adapter = adapter;
        this.name = name;
        this._isTransaction = false;
        this._isTransactionRollback = false;
        this._transactionRecords = [];
    }
    _isTransaction;
    _isTransactionRollback;
    _transactionRecords;
    transaction(cb) {
        return new Promise(async (resolve, reject)=>{
            this._isTransaction = true;
            try {
                const result = await cb();
                resolve(result);
            } catch (e) {
                this._isTransactionRollback = true;
                for (let transactionRecord of this._transactionRecords.reverse()){
                    if (transactionRecord.type === "add") {
                        await this.delete({
                            _id: transactionRecord.value._id
                        });
                    } else if (transactionRecord.type === "delete") {
                        await this.add(transactionRecord.value);
                    } else if (transactionRecord.type === "update") {
                        await this.update(transactionRecord.oldValue);
                    }
                }
                this._transactionRecords.length = 0;
                this._isTransactionRollback = false;
                reject(e);
            }
            this._isTransaction = false;
        });
    }
    add(...items) {
        if (this._isTransaction && !this._isTransactionRollback) items.forEach((value)=>this._transactionRecords.push({
                type: "add",
                value
            }));
        return this.adapter.add(this.name, ...items);
    }
    async update(...items) {
        if (this._isTransaction && !this._isTransactionRollback) {
            const promiseArray = items.map(async (value)=>{
                const oldValue = await this.getById(value._id);
                this._transactionRecords.push({
                    type: "update",
                    oldValue
                });
            });
            await Promise.all(promiseArray);
        }
        return this.adapter.update(this.name, ...items);
    }
    search(condition, sortOrders) {
        return this.adapter.search(this.name, condition, sortOrders);
    }
    paginationSearch(condition, curPage, pageSize, sortOrders) {
        return this.adapter.paginationSearch(this.name, condition, curPage, pageSize, sortOrders);
    }
    async delete(condition) {
        const deleted = await this.adapter.delete(this.name, condition);
        if (this._isTransaction && !this._isTransactionRollback) {
            deleted.forEach((value)=>this._transactionRecords.push({
                    type: "delete",
                    value
                }));
        }
        return deleted;
    }
    async searchOne(condition) {
        const result = await this.search(condition);
        return result[0];
    }
    async getById(id) {
        const result = await this.search({
            _id: id
        });
        return result[0];
    }
    async getAll() {
        return await this.search();
    }
    async save(data) {
        const exist = data._id ? !!await this.getById(data._id) : false;
        if (!exist) {
            const ids = await this.add(data);
            data._id = ids[0];
        } else {
            await this.update(data);
        }
        return data;
    }
    async count(condition) {
        const result = await this.search(condition);
        return result.length;
    }
}
/* 参数装饰器 */ function Store(label = ServerStore.name) {
    return Inject({
        typeValueGetter: (container)=>container.getValue(label)
    });
}
/* 参数装饰器 */ function Collection(name, storeLabel = ServerStore.name) {
    return Inject({
        typeValueGetter: (container)=>container.getValue(storeLabel).collection(name)
    });
}

export { Collection, ServerStore, Store, StoreCollection };
