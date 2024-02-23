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

  private _clearCache() {
    this._data = undefined;
  }
}
