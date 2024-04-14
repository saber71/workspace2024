///<reference types="../types.d.ts"/>

import { deepAssign, deepClone } from "common";
import { parseFilterCondition, sortData } from "filter";
import * as fs from "node:fs";
import * as path from "node:path";
import { v4 } from "uuid";

export function createServerStoreFS(
  basePath: string = ".",
  saveOnExit = false,
): StoreAdapter {
  basePath = path.resolve(basePath);
  const collections = initCollections();
  const needSaveCollectionNames = new Set<string>();
  if (saveOnExit) {
    process.on("exit", saveDataToFile);
    process.on("SIGINT", saveDataToFile);
    setInterval(saveCollectionChange, 1000);
  }

  return {
    init(): Promise<void> {
      return Promise.resolve();
    },
    getById<T extends StoreItem>(
      collectionName: string,
      id: string,
    ): Promise<T | undefined> {
      return Promise.resolve(
        collections.get(collectionName)?.data[id] as T | undefined,
      );
    },
    add<T extends StoreItem>(
      collectionName: string,
      ...items: Array<PartialStoreItem<T>>
    ): Promise<string[]> {
      needSaveCollectionNames.add(collectionName);
      const collection = getCollection(collectionName);
      const ids: string[] = [];
      for (let item of items) {
        const id = (item._id = item._id ?? v4());
        item = deepClone(item);
        if (id in collection.data)
          throw new Error("Failed to insert data: Duplicate id");
        collection.data[id] = item as T;
        ids.push(id);
      }
      return Promise.resolve(ids);
    },
    async search<T extends StoreItem>(
      collectionName: string,
      condition?: FilterCondition<T>,
      sortOrders?: SortOrders<T>,
    ): Promise<T[]> {
      const collection = getCollection(collectionName);
      return query(collection, condition, sortOrders);
    },
    async update(collectionName: string, ...items): Promise<void> {
      needSaveCollectionNames.add(collectionName);
      const collection = getCollection(collectionName);
      for (let item of items) {
        const id = (item._id = item._id ?? v4());
        item = deepClone(item);
        if (!collection.data[id]) collection.data[id] = item as any;
        else deepAssign(collection.data[id], item);
      }
    },
    async paginationSearch<T extends StoreItem>(
      collectionName: string,
      condition: FilterCondition<T> | undefined | null,
      curPage: number,
      pageSize: number,
      sortOrders?: SortOrders,
    ): Promise<PaginationResult<T>> {
      const collection = getCollection(collectionName);
      const result = query(collection, condition, sortOrders);
      return {
        total: result.length,
        curPage,
        pageSize,
        data: result.slice((curPage - 1) * pageSize, curPage * pageSize),
      };
    },
    async delete<T extends StoreItem>(
      collectionName: string,
      condition?: FilterCondition<StoreItem>,
    ): Promise<T[]> {
      needSaveCollectionNames.add(collectionName);
      const collection = getCollection(collectionName);
      const result = query(collection, condition);
      const deleted: T[] = [];
      for (let item of result) {
        deleted.push(item as T);
        delete collection.data[item._id];
      }
      return deleted;
    },
  };

  function initCollections() {
    const collections = new Map<string, Collection>();
    if (fs.existsSync(basePath)) {
      const subNames = fs.readdirSync(basePath);
      for (let sub of subNames) {
        const filePath = path.join(basePath, sub);
        if (fs.lstatSync(filePath).isDirectory()) continue;
        const content = fs.readFileSync(filePath, "utf8");
        const arr = JSON.parse(content);
        const data: any = {};
        for (let item of arr) {
          data[item._id] = item;
        }
        collections.set(sub, {
          path: filePath,
          data,
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

  function saveCollections(collectionNames: string[], sync: boolean = true) {
    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
    for (let collectionName of collectionNames) {
      const collection = collections.get(collectionName);
      if (collection) {
        const content = JSON.stringify(Object.values(collection.data));
        if (sync) fs.writeFileSync(collection.path, content);
        else
          fs.writeFile(collection.path, content, (err) => {
            if (err) throw err;
          });
      }
    }
  }

  function getCollection(name: string): Collection {
    let collection = collections.get(name);
    if (!collection) {
      collections.set(
        name,
        (collection = {
          path: path.resolve(basePath, name),
          data: {},
        }),
      );
    }
    return collection;
  }

  function query<T extends StoreItem>(
    collection: Collection,
    condition?: FilterCondition<T> | null,
    sortOrders?: SortOrders,
  ): T[] {
    const filterPredicates = parseFilterCondition(condition);
    const allData = Object.values(collection.data);
    const result = filterPredicates.length
      ? allData.filter((item) => filterPredicates.every((fn) => fn(item)))
      : allData.slice();
    if (sortOrders) sortData(result, sortOrders);
    return result.map((value) => deepClone(value)) as T[];
  }
}
