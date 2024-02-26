import type { Table } from "dexie";
import { v4 } from "uuid";

interface KeyValue<T> {
  key: string;
  value: T;
}

type Item<T extends { id: string }> = Omit<T, "id"> & { id?: string };

export class IndexDBTable<T extends { id: string }> {
  private _data?: T[];

  constructor(readonly table: Table<KeyValue<T>, string>) {}

  async getAll(): Promise<T[]> {
    if (!this._data)
      this._data = (await this.table.toArray()).map((item) => item.value);
    return this._data;
  }

  async add(item: Item<T>) {
    this._clearCache();
    if (!item.id) item.id = v4();
    return this.table.add({
      key: item.id,
      value: item as T,
    });
  }

  async bulkAdd(...items: Item<T>[]) {
    this._clearCache();
    return this.table.bulkAdd(
      items.map((item) => {
        if (!item.id) item.id = v4();
        return { key: item.id, value: item as T };
      }),
    );
  }

  async delete(id: string) {
    this._clearCache();
    return this.table.delete(id);
  }

  async bulkDelete(...ids: string[]) {
    this._clearCache();
    return this.table.bulkDelete(ids);
  }

  async put(item: Item<T>) {
    this._clearCache();
    if (!item.id) item.id = v4();
    return this.table.put({
      key: item.id,
      value: item as T,
    });
  }

  async bulkPut(...items: Item<T>[]) {
    this._clearCache();
    return this.table.bulkPut(
      items.map((item) => {
        if (!item.id) item.id = v4();
        return { key: item.id, value: item as T };
      }),
    );
  }

  async fetchById(id: string) {
    const result = await this.getById(id);
    if (!result)
      throw new IndexdbNotFoundError(
        `"Unable to find the value corresponding to the id ` + id,
      );
    return result;
  }

  async getById(id: string) {
    return (await this.table.get({ key: id }))?.value;
  }

  async search(predicate: (item: T) => boolean) {
    return (await this.getAll()).filter(predicate);
  }

  async searchOne(predicate: (item: T) => boolean) {
    const list = await this.getAll();
    for (let item of list) {
      if (predicate(item)) return item;
    }
    return undefined;
  }

  async searchPagination(
    predicate: (item: T) => boolean,
    page: number = 1,
    size: number = 10,
  ) {
    if (page < 1) page = 1;
    if (size < 0) size = 10;
    const arr = await this.search(predicate);
    return {
      data: arr.slice((page - 1) * size, page * size),
      curPage: page,
      size,
      totalCount: arr.length,
    } satisfies PaginationResult<T>;
  }

  private _clearCache() {
    this._data = undefined;
  }
}

export interface PaginationResult<T> {
  curPage: number;
  size: number;
  totalCount: number;
  data: T[];
}

export class IndexdbNotFoundError extends Error {}