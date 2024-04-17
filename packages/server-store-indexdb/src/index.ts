///<reference types="../types.d.ts"/>

import { parseFilterCondition, sortData } from "filter";
import { v4 } from "uuid";

export function createServerStoreIndexdb(): StoreAdapter {
  const dbMap = new Map<string, IDBDatabase>();

  return {
    async add<T extends StoreItem>(
      collectionName: string,
      ...items: PartialStoreItem<T>[]
    ): Promise<string[]> {
      const ids: string[] = [];
      const store = await getObjectStore(collectionName);
      const promises: Promise<void>[] = [];
      for (let item of items) {
        if (!item._id) item._id = v4();
        ids.push(item._id);
        promises.push(wrapRequest(store.add(item)));
      }
      await Promise.all(promises);
      return ids;
    },
    async delete<T extends StoreItem>(
      collectionName: string,
      condition?: FilterCondition<T>,
    ): Promise<T[]> {
      const store = await getObjectStore(collectionName);
      const array = await query(store, condition);
      await Promise.all(
        array.map((item) => wrapRequest(store.delete(item._id))),
      );
      return Promise.resolve(array);
    },
    async getById<T extends StoreItem>(
      collectionName: string,
      id: string,
    ): Promise<T | undefined> {
      const store = await getObjectStore(collectionName, "readonly");
      const request = store.get(id);
      return await wrapRequest(request);
    },
    init(): Promise<void> {
      return Promise.resolve();
    },
    async paginationSearch<T extends StoreItem>(
      collectionName: string,
      condition: FilterCondition<T> | undefined | null,
      curPage: number,
      pageSize: number,
      sortOrders?: SortOrders<T>,
    ): Promise<PaginationResult<T>> {
      const array = await this.search(collectionName, condition, sortOrders);
      return {
        data: array.slice((curPage - 1) * pageSize, curPage * pageSize),
        curPage,
        pageSize,
        total: array.length,
      };
    },
    async search<T extends StoreItem>(
      collectionName: string,
      condition?: FilterCondition<T> | null,
      sortOrders?: SortOrders<T>,
    ): Promise<T[]> {
      const store = await getObjectStore(collectionName);
      return await query(store, condition, sortOrders);
    },
    async update<T extends StoreItem>(
      collectionName: string,
      ...items: PartialStoreItem<T>[]
    ): Promise<void> {
      const store = await getObjectStore(collectionName);
      await Promise.all(items.map((item) => wrapRequest(store.put(item))));
    },
  };

  async function query(
    store: IDBObjectStore,
    condition?: FilterCondition<any> | null,
    sortOrders?: SortOrders,
  ) {
    const filters = !condition ? [() => true] : parseFilterCondition(condition);
    const array = await new Promise<any[]>((resolve, reject) => {
      const cursor = store.openCursor();
      const array: any[] = [];
      cursor.onsuccess = () => {
        if (cursor.result) {
          if (filters.every((fn) => fn(cursor.result!.value)))
            array.push(cursor.result.value);
          cursor.result.continue();
        } else resolve(array);
      };
    });
    if (sortOrders) sortData(array, sortOrders);
    return array;
  }

  function wrapRequest(req: IDBRequest) {
    return new Promise<any>((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = reject;
    });
  }

  async function getObjectStore(
    collectionName: string,
    mode: IDBTransactionMode = "readwrite",
  ): Promise<IDBObjectStore> {
    const db = await getDatabase(collectionName);
    return db.transaction(["key-value"], mode).objectStore("key-value");
  }

  async function getDatabase(collectionName: string) {
    let db = dbMap.get(collectionName);
    if (!db) {
      db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(collectionName, 1);
        request.onerror = reject;
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onupgradeneeded = (e) => {
          const db = (e.target as any).result as IDBDatabase;
          db.createObjectStore("key-value", { keyPath: "_id" });
        };
      });
      dbMap.set(collectionName, db);
    }
    return db;
  }
}
