///<reference types="../types.d.ts"/>

export class ServerStore {
  private constructor(readonly adapter: StoreAdapter) {}

  private readonly _collectionMap = new Map<string, StoreCollection<any>>();

  static async create(adapter: StoreAdapter) {
    await adapter.init();
    return new ServerStore(adapter);
  }

  collection<T extends StoreItem>(name: string): StoreCollection<T> {
    let collection = this._collectionMap.get(name);
    if (!collection)
      this._collectionMap.set(
        name,
        (collection = new StoreCollection<T>(this.adapter, name)),
      );
    return collection;
  }
}

export class StoreCollection<T extends StoreItem> {
  constructor(
    readonly adapter: StoreAdapter,
    readonly name: string,
  ) {}

  add(...items: PartialStoreItem<T>[]): Promise<string[]> {
    return this.adapter.add(this.name, ...items);
  }

  update(...items: T[]): Promise<void> {
    return this.adapter.update(this.name, ...items);
  }

  search(
    condition?: FilterCondition<T>,
    sortOrders?: SortOrders<T>,
  ): Promise<T[]> {
    return this.adapter.search(this.name, condition, sortOrders);
  }

  paginationSearch(
    condition: FilterCondition<T> | undefined | null,
    curPage: number,
    pageSize: number,
    sortOrders?: SortOrders<T>,
  ): Promise<PaginationResult<T>> {
    return this.adapter.paginationSearch(
      this.name,
      condition,
      curPage,
      pageSize,
      sortOrders,
    );
  }

  delete(condition?: FilterCondition<T>): Promise<string[]> {
    return this.adapter.delete(this.name, condition);
  }

  async getById(id: string): Promise<T | undefined> {
    const result = await this.search({ _id: id } as FilterCondition<T>);
    return result[0] as T;
  }

  async getAll(): Promise<T[]> {
    return await this.search();
  }

  async save(data: PartialStoreItem<T>): Promise<T> {
    const exist = data._id ? !!(await this.getById(data._id)) : false;
    if (!exist) {
      const ids = await this.add(data);
      data._id = ids[0];
    } else {
      await this.update(data as T);
    }
    return data as T;
  }
}
