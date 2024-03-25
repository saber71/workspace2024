///<reference types="../types.d.ts"/>
class ServerStore {
    adapter;
    constructor(adapter){
        this.adapter = adapter;
        this._collectionMap = new Map();
    }
    _collectionMap;
    static async create(adapter) {
        await adapter.init();
        return new ServerStore(adapter);
    }
    collection(name) {
        let collection = this._collectionMap.get(name);
        if (!collection) this._collectionMap.set(name, collection = new StoreCollection(this.adapter, name));
        return collection;
    }
}
class StoreCollection {
    adapter;
    name;
    constructor(adapter, name){
        this.adapter = adapter;
        this.name = name;
    }
    add(...items) {
        return this.adapter.add(this.name, ...items);
    }
    update(...items) {
        return this.adapter.update(this.name, ...items);
    }
    search(condition, sortOrders) {
        return this.adapter.search(this.name, condition, sortOrders);
    }
    paginationSearch(condition, curPage, pageSize, sortOrders) {
        return this.adapter.paginationSearch(this.name, condition, curPage, pageSize, sortOrders);
    }
    delete(condition) {
        return this.adapter.delete(this.name, condition);
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
}

export { ServerStore, StoreCollection };
