var c = Object.defineProperty;
var d = (r, t, a) => t in r ? c(r, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : r[t] = a;
var h = (r, t) => c(r, "name", { value: t, configurable: !0 });
var u = (r, t, a) => (d(r, typeof t != "symbol" ? t + "" : t, a), a);
import { v4 as l } from "uuid";
const i = class i {
  constructor(t) {
    u(this, "_data");
    this.table = t;
  }
  async getAll() {
    return this._data || (this._data = (await this.table.toArray()).map((t) => t.value)), this._data;
  }
  async add(t) {
    return this._clearCache(), t.id || (t.id = l()), this.table.add({
      key: t.id,
      value: t
    });
  }
  async bulkAdd(...t) {
    return this._clearCache(), this.table.bulkAdd(
      t.map((a) => (a.id || (a.id = l()), { key: a.id, value: a }))
    );
  }
  async delete(t) {
    return this._clearCache(), this.table.delete(t);
  }
  async bulkDelete(...t) {
    return this._clearCache(), this.table.bulkDelete(t);
  }
  async put(t) {
    return this._clearCache(), t.id || (t.id = l()), this.table.put({
      key: t.id,
      value: t
    });
  }
  async bulkPut(...t) {
    return this._clearCache(), this.table.bulkPut(
      t.map((a) => (a.id || (a.id = l()), { key: a.id, value: a }))
    );
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
    const s = await this.search(t);
    return {
      data: s.slice((a - 1) * e, a * e),
      curPage: a,
      size: e,
      totalCount: s.length
    };
  }
  _clearCache() {
    this._data = void 0;
  }
};
h(i, "IndexDBTable");
let n = i;
export {
  n as IndexDBTable
};
