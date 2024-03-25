///<reference types="../types.d.ts"/>

import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import { v4 } from "uuid";

export function createServerStoreFS(
  basePath: string = path.resolve("."),
): StoreAdapter {
  process.on("exit", onExit);
  const collections = initCollections();

  return {
    init(): Promise<void> {
      return Promise.resolve();
    },
    add<T extends StoreItem>(
      collectionName: string,
      ...items: Array<PartialStoreItem<T>>
    ): Promise<string[]> {
      const collection = getCollection(collectionName);
      const ids: string[] = [];
      for (let item of items) {
        item._id = item._id ?? v4();
        if (item._id in collection.data)
          throw new Error("Failed to insert data: Duplicate id");
        collection.data[item._id] = Object.assign({}, item) as T;
        ids.push(item._id);
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
      const collection = getCollection(collectionName);
      for (let item of items) {
        item._id = item._id ?? v4();
        if (!collection.data[item._id])
          collection.data[item._id] = Object.assign({}, item);
        else Object.assign(collection.data[item._id], item);
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
    async delete(
      collectionName: string,
      condition?: FilterCondition<StoreItem>,
    ): Promise<string[]> {
      const collection = getCollection(collectionName);
      const result = query(collection, condition);
      const ids: string[] = [];
      for (let item of result) {
        ids.push(item._id);
        delete collection.data[item._id];
      }
      return ids;
    },
  };

  function initCollections() {
    const collections = new Map<string, Collection>();
    const subNames = fs.readdirSync(basePath);
    for (let sub of subNames) {
      const filePath = path.join(basePath, sub);
      if (fs.lstatSync(filePath).isDirectory()) continue;
      const content = fs.readFileSync(filePath, "utf8");
      collections.set(sub, {
        path: filePath,
        data: JSON.parse(content),
      });
    }
    return collections;
  }

  function onExit() {
    if (!collections) return;
    for (let collection of collections.values()) {
      fs.writeFileSync(collection.path, JSON.stringify(collection.data));
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
    if (sortOrders) {
      const sortPredicates: Array<(a: StoreItem, b: StoreItem) => number> =
        sortOrders.map((item) => {
          if (item.order === "asc")
            return (a, b) => a[item.field] - b[item.field];
          else return (a, b) => b[item.field] - a[item.field];
        });
      result.sort((a, b) => {
        for (let sortPredicate of sortPredicates) {
          const value = sortPredicate(a, b);
          if (value) return value;
        }
        return 0;
      });
    }
    return result as T[];
  }
}

export function matchFilterCondition<T extends StoreItem>(
  data: T,
  condition: FilterCondition<T>,
) {
  const filterPredicates = parseFilterCondition(condition);
  return filterPredicates.every((fn) => fn(data));
}

function parseFilterCondition(
  condition?: FilterCondition<StoreItem> | null,
): Array<(item: StoreItem) => boolean> {
  if (!condition) return [];
  const filterPredicates: Array<(item: StoreItem) => boolean> = [];
  for (let keyOrPropName in condition) {
    const value = condition[keyOrPropName];
    if (keyOrPropName === "$or" || keyOrPropName === "$nor") {
      const filterConditions = value as FilterCondition<StoreItem>[];
      const conditions = filterConditions.map(parseFilterCondition);
      if (keyOrPropName === "$or") {
        filterPredicates.push((item) => {
          for (let fnArray of conditions) {
            if (fnArray.every((fn) => fn(item))) return true;
          }
          return false;
        });
      } else {
        filterPredicates.push((item) => {
          for (let fnArray of conditions) {
            if (fnArray.every((fn) => fn(item))) return false;
          }
          return true;
        });
      }
    } else {
      if (isCondition(value)) {
        parseCondition(keyOrPropName, value, filterPredicates);
      } else {
        filterPredicates.push((item) => item[keyOrPropName] === value);
      }
    }
  }
  return filterPredicates;
}

function parseCondition(
  propName: string,
  condition: Condition<any>,
  filterPredicates: Array<(item: StoreItem) => boolean>,
) {
  for (let conditionKey in condition) {
    let conditionValue = (condition as any)[conditionKey];
    if (conditionValue === undefined) continue;
    if (conditionKey === "$less")
      filterPredicates.push((item) => item[propName] < conditionValue);
    else if (conditionKey === "$greater")
      filterPredicates.push((item) => item[propName] > conditionValue);
    else if (conditionKey === "$lessEqual")
      filterPredicates.push((item) => item[propName] <= conditionValue);
    else if (conditionKey === "$greaterEqual")
      filterPredicates.push((item) => item[propName] >= conditionValue);
    else if (conditionKey === "$not")
      filterPredicates.push((item) => item[propName] !== conditionValue);
    else if (conditionKey === "$dateBefore") {
      if (conditionValue instanceof Date)
        conditionValue = conditionValue.getTime();
      filterPredicates.push((item) => {
        let value = item[propName];
        if (value instanceof Date) value = value.getTime();
        else if (typeof value === "string") value = new Date(value).getTime();
        return value < conditionValue;
      });
    } else if (conditionKey === "$dateAfter") {
      if (conditionValue instanceof Date)
        conditionValue = conditionValue.getTime();
      filterPredicates.push((item) => {
        let value = item[propName];
        if (value instanceof Date) value = value.getTime();
        else if (typeof value === "string") value = new Date(value).getTime();
        return value > conditionValue;
      });
    } else if (conditionKey === "$or") {
      const conditions: Array<(item: StoreItem) => boolean> = [];
      conditionValue.forEach((condition: Condition<any>) =>
        parseCondition(propName, condition, conditions),
      );
      filterPredicates.push((item) => {
        for (let predicate of conditions) {
          if (predicate(item)) return true;
        }
        return false;
      });
    } else if (conditionKey === "$nor") {
      const conditions: Array<(item: StoreItem) => boolean> = [];
      conditionValue.forEach((condition: Condition<any>) =>
        parseCondition(propName, condition, conditions),
      );
      filterPredicates.push((item) => {
        for (let predicate of conditions) {
          if (predicate(item)) return false;
        }
        return true;
      });
    } else if (conditionKey === "$in") {
      filterPredicates.push((item) => conditionValue.includes(item[propName]));
    } else if (conditionKey === "$notIn") {
      filterPredicates.push((item) => !conditionValue.includes(item[propName]));
    } else if (conditionKey === "$contains") {
      filterPredicates.push((item) => {
        const value = item[propName];
        if (value instanceof Array) {
          if (conditionValue instanceof Array) {
            for (let cond of conditionValue) {
              if (!value.includes(cond)) return false;
            }
            return true;
          } else return value.includes(conditionValue);
        } else if (typeof value === "string") {
          if (conditionValue instanceof Array) {
            for (let cond of conditionValue) {
              if (!value.includes(cond)) return false;
            }
            return true;
          } else return value.includes(conditionValue);
        }
        return false;
      });
    } else if (conditionKey === "$notContains") {
      filterPredicates.push((item) => {
        const value = item[propName];
        if (value instanceof Array) {
          if (conditionValue instanceof Array) {
            for (let cond of conditionValue) {
              if (value.includes(cond)) return false;
            }
            return true;
          } else return !value.includes(conditionValue);
        } else if (typeof value === "string") {
          if (conditionValue instanceof Array) {
            for (let cond of conditionValue) {
              if (value.includes(cond)) return false;
            }
            return true;
          } else return !value.includes(conditionValue);
        }
        return false;
      });
    } else if (conditionKey === "$match") {
      if (typeof conditionValue === "string")
        conditionValue = new RegExp(conditionValue);
      filterPredicates.push((item) =>
        (conditionValue as RegExp).test(item[propName]),
      );
    }
  }
}

function isCondition(arg?: any): arg is Condition<any> {
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
    "$match",
  ];
  for (let key of keys) {
    if (key in arg) return true;
  }
  return false;
}
