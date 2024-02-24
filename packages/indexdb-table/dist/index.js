var u = Object.defineProperty;
var o = (r, t, a) => t in r ? u(r, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : r[t] = a;
var l = (r, t) => u(r, "name", { value: t, configurable: !0 });
var d = (r, t, a) => (o(r, typeof t != "symbol" ? t + "" : t, a), a);
import { v4 as s } from "uuid";
const c = class c {
  constructor(t) {
    d(this, "_data");
    this.table = t;
  }
  async getAll() {
    return this._data || (this._data = (await this.table.toArray()).map((t) => t.value)), this._data;
  }
  async add(t) {
    return this._clearCache(), t.id || (t.id = s()), this.table.add({
      key: t.id,
      value: t
    });
  }
  async bulkAdd(...t) {
    return this._clearCache(), this.table.bulkAdd(
      t.map((a) => (a.id || (a.id = s()), { key: a.id, value: a }))
    );
  }
  async delete(t) {
    return this._clearCache(), this.table.delete(t);
  }
  async bulkDelete(...t) {
    return this._clearCache(), this.table.bulkDelete(t);
  }
  async put(t) {
    return this._clearCache(), t.id || (t.id = s()), this.table.put({
      key: t.id,
      value: t
    });
  }
  async bulkPut(...t) {
    return this._clearCache(), this.table.bulkPut(
      t.map((a) => (a.id || (a.id = s()), { key: a.id, value: a }))
    );
  }
  async fetchById(t) {
    const a = await this.getById(t);
    if (!a)
      throw new i(
        '"Unable to find the value corresponding to the id ' + t
      );
    return a;
  }
  async getById(t) {
    var a;
    return (a = await this.table.get({ key: t })) == null ? void 0 : a.value;
  }
  async search(t) {
    return (await this.getAll()).filter(t);
  }
  async searchOne(t) {
    const a = await this.getAll();
    for (let e of a)
      if (t(e))
        return e;
  }
  async searchPagination(t, a = 1, e = 10) {
    a < 1 && (a = 1), e < 0 && (e = 10);
    const n = await this.search(t);
    return {
      data: n.slice((a - 1) * e, a * e),
      curPage: a,
      size: e,
      totalCount: n.length
    };
  }
  _clearCache() {
    this._data = void 0;
  }
};
l(c, "IndexDBTable");
let y = c;
const h = class h extends Error {
};
l(h, "IndexdbNotFoundError");
let i = h;
export {
  y as IndexDBTable,
  i as IndexdbNotFoundError
};
